"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { INSURANCE_SELECTION_FIELD } from "@/config/forms";
import {
  INSURANCE_TYPE_INFO,
  insuranceTypeFromSlug,
  type InsuranceType,
} from "@/config/forms/insurance-types";
import type { FormConfig, StepConfig } from "@/config/forms/types";
import { draftableValues, loadDraft, saveDraft } from "@/lib/form/draft";
import { getVisibleFields } from "@/lib/form/visibility";
import {
  getActiveSteps,
  getSelectedTypes,
  type FormValues,
} from "@/lib/form/step-sequence";
import {
  buildDefaultValues,
  buildStepSchema,
  findFirstInvalidStep,
} from "@/lib/schemas/build-schema";
import { FieldRenderer, fieldPath } from "./field-renderer";
import { StepNavigation } from "./step-navigation";
import { StepProgress } from "./step-progress";

/** Current step id in the URL, so the browser back button works. */
const STEP_PARAM = "trin";
/** Preselects insurance types by slug, e.g. ?forsikring=bil,hus */
const PRESELECT_PARAM = "forsikring";

function getInitialValues(
  config: FormConfig,
  preselect: string | null,
): FormValues {
  const values: FormValues = {
    ...buildDefaultValues(config),
    ...loadDraft(config.version),
  };
  if (preselect) {
    const preselected = preselect
      .split(",")
      .map(insuranceTypeFromSlug)
      .filter((type): type is InsuranceType => type !== undefined);
    values[INSURANCE_SELECTION_FIELD] = getSelectedTypes({
      [INSURANCE_SELECTION_FIELD]: [...getSelectedTypes(values), ...preselected],
    });
  }
  return values;
}

const subscribeNothing = () => () => {};

/** False on the server and during hydration, true once in the browser. */
function useIsClient() {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

/**
 * The multi-step form, rendered entirely from the form config. Each step is
 * validated with its generated zod schema before the user can move on.
 *
 * It renders only in the browser: the initial values come from the
 * sessionStorage draft, which the server cannot see, so server-rendering
 * the form would cause a hydration mismatch.
 *
 * Uses useSearchParams, so it must be rendered inside <Suspense>.
 */
type FormWizardProps = {
  config: FormConfig;
  /**
   * Called when the last step is submitted and valid, with all form values.
   * The receiver must validate them again (the server always does).
   * Returns a Danish error message to show, or undefined on success.
   */
  onComplete?: (values: FormValues) => Promise<string | undefined>;
};

export function FormWizard(props: FormWizardProps) {
  const isClient = useIsClient();
  return isClient ? <WizardForm {...props} /> : <FormWizardSkeleton />;
}

function WizardForm({ config, onComplete }: FormWizardProps) {
  const searchParams = useSearchParams();
  const [defaultValues] = useState(() =>
    getInitialValues(config, searchParams.get(PRESELECT_PARAM)),
  );

  // The resolver validates only the current step. It reads the step from a
  // ref, because react-hook-form keeps the resolver from the first render.
  const stepRef = useRef<StepConfig>(config.steps[0]);
  const resolver = useCallback<Resolver<FormValues>>(
    (values, context, options) =>
      (
        zodResolver(
          buildStepSchema(stepRef.current, values),
        ) as unknown as Resolver<FormValues>
      )(values, context, options),
    [],
  );

  const form = useForm<FormValues>({ defaultValues, resolver });
  const values = useWatch({ control: form.control }) as FormValues;

  const selected = getSelectedTypes(values);
  const steps = getActiveSteps(config, selected);

  // The requested step, unless an earlier step is invalid (deep link,
  // reload, or browser forward): then the first invalid step is shown.
  const requestedId = searchParams.get(STEP_PARAM);
  const requestedIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === requestedId),
  );
  const firstInvalid = findFirstInvalidStep(
    steps.slice(0, requestedIndex),
    values,
  );
  const index = firstInvalid === -1 ? requestedIndex : firstInvalid;
  const step = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const stepUrl = useCallback(
    (stepId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(STEP_PARAM, stepId);
      params.delete(PRESELECT_PARAM);
      return `?${params.toString()}`;
    },
    [searchParams],
  );

  // Keep the URL in sync with the step actually shown.
  useEffect(() => {
    if (requestedId !== step.id || searchParams.has(PRESELECT_PARAM)) {
      window.history.replaceState(null, "", stepUrl(step.id));
    }
  }, [requestedId, step.id, searchParams, stepUrl]);

  // On every step change: reset validation state, scroll up, and move focus
  // to the heading so screen readers announce the new step.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownStepId = useRef(step.id);
  useEffect(() => {
    if (shownStepId.current === step.id) {
      return;
    }
    shownStepId.current = step.id;
    form.reset(undefined, {
      keepValues: true,
      keepDefaultValues: true,
      keepDirty: true,
      keepTouched: true,
    });
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step.id, form]);

  // Save a draft on every change (without personal data and consents).
  useEffect(() => {
    saveDraft(config.version, draftableValues(config, values));
  }, [config, values]);

  function goTo(stepId: string) {
    window.history.pushState(null, "", stepUrl(stepId));
  }

  const [completeError, setCompleteError] = useState<string>();
  const onSubmit = form.handleSubmit(async () => {
    if (!isLast) {
      goTo(steps[index + 1].id);
      return;
    }
    setCompleteError(undefined);
    if (!onComplete) {
      setCompleteError("Indsendelse er ikke åbnet endnu.");
      return;
    }
    const error = await onComplete(form.getValues());
    setCompleteError(error);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <StepProgress current={index + 1} total={steps.length} />

      <div className="flex-1">
        <div className="mt-6 space-y-2">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
          >
            {step.title}
          </h1>
          {step.description && (
            <p className="text-muted-foreground">{step.description}</p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {isLast && <SelectedSummary types={selected} />}
          {getVisibleFields(step, values).map((field) => (
            <FieldRenderer
              key={fieldPath(step, field)}
              step={step}
              field={field}
              control={form.control}
            />
          ))}
          {completeError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {completeError}
            </p>
          )}
        </div>
      </div>

      <StepNavigation
        canGoBack={index > 0}
        onBack={() => goTo(steps[index - 1].id)}
        isLast={isLast}
        busy={form.formState.isSubmitting}
      />
    </form>
  );
}

function SelectedSummary({ types }: { types: InsuranceType[] }) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <p className="text-sm text-muted-foreground">Du har valgt</p>
      <ul className="mt-2 space-y-1 font-medium">
        {types.map((type) => (
          <li key={type}>{INSURANCE_TYPE_INFO[type].label}</li>
        ))}
      </ul>
    </div>
  );
}

/** Placeholder shown while the form loads on the client. */
export function FormWizardSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-2 rounded-full bg-muted" />
      </div>
      <div className="h-8 w-3/4 rounded bg-muted" />
      <div className="grid gap-3">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
