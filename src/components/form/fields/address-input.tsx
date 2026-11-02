"use client";

import { CheckIcon, MapPinIcon } from "lucide-react";
import { useEffect, useState, type KeyboardEvent, type Ref } from "react";

import { Input } from "@/components/ui/input";
import type { AddressField, AddressValue } from "@/config/forms/types";
import { cn } from "@/lib/utils";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldIds,
} from "./field-parts";

type Suggestion = { id: string; text: string };

type AddressInputProps = {
  field: AddressField;
  ids: FieldIds;
  value: AddressValue | undefined;
  onChange: (value: AddressValue | undefined) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
};

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 200;

/** Answers per query for this page view. */
const searches = new Map<string, Suggestion[]>();

async function searchAddresses(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  const cached = searches.get(query);
  if (cached) {
    return cached;
  }
  const response = await fetch(`/api/adresser?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) {
    throw new Error(`Address search answered ${response.status}`);
  }
  const { suggestions } = (await response.json()) as { suggestions: Suggestion[] };
  searches.set(query, suggestions);
  return suggestions;
}

/**
 * An address with suggestions while typing (a combobox). Picking a
 * suggestion stores its DAR id, which other fields use to fill in facts
 * from BBR. If the search finds nothing or is down, the typed text is kept.
 */
export function AddressInput({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: AddressInputProps) {
  const text = value?.text ?? "";
  const picked = Boolean(value?.id);
  const query = text.replace(/\s+/g, " ").trim();
  const listId = `${ids.input}-list`;

  const [results, setResults] = useState<{ query: string; items: Suggestion[] }>();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Search while the user types (not after picking an address).
  useEffect(() => {
    if (picked || query.length < MIN_QUERY_LENGTH) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchAddresses(query, controller.signal)
        .then((items) => {
          setResults({ query, items });
          setActive(-1);
        })
        .catch(() => {
          // Search unavailable: the user can type the full address.
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, picked]);

  const current = !picked && results?.query === query ? results.items : [];
  const showList = open && current.length > 0;
  const nothingFound =
    open && !picked && results?.query === query && current.length === 0;

  function pick(suggestion: Suggestion) {
    onChange({ text: suggestion.text, id: suggestion.id });
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showList) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % current.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? current.length - 1 : index - 1));
    } else if (event.key === "Enter" && active >= 0) {
      // Pick the suggestion instead of submitting the step.
      event.preventDefault();
      pick(current[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      <div className="relative">
        <MapPinIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          id={ids.input}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          value={text}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next ? { text: next } : undefined);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            onBlur();
          }}
          onKeyDown={onKeyDown}
          placeholder={field.placeholder}
          maxLength={200}
          autoComplete="off"
          spellCheck={false}
          className={cn("h-11 pl-9 text-base md:text-base", picked && "pr-10")}
          {...describedBy(field, ids, error)}
        />
        {picked && (
          <CheckIcon
            aria-label="Adressen er fundet"
            className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-primary"
          />
        )}
        <ul
          id={listId}
          role="listbox"
          aria-label="Forslag til adresser"
          hidden={!showList}
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-md"
        >
          {current.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // Keep focus in the input, so blur does not close the list first.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(suggestion)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center rounded-md px-3 py-2 text-base",
                index === active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
              )}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      </div>
      {nothingFound && (
        <p className="text-sm text-muted-foreground">
          Vi kan ikke finde adressen. Tjek stavningen, eller skriv den helt ud.
        </p>
      )}
      <FieldError ids={ids} error={error} />
    </div>
  );
}
