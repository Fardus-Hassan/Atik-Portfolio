"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { IconField } from "@/components/admin/icon-picker";
import { MediaField } from "@/components/admin/media-picker";
import { input, label as labelClass } from "@/components/admin/ui";

export type JsonSchema = {
  type?: string;
  title?: string;
  description?: string;
  widget?: "textarea" | "image" | "file" | "color" | "icon";
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  enum?: string[];
  const?: unknown;
  minimum?: number;
  maximum?: number;
};

type Value = unknown;
type Path = (string | number)[];
type Change = (value: Value) => void;

export const ErrorsContext = createContext<Map<string, string>>(new Map());

const humanize = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

function splitNullable(schema: JsonSchema): { inner: JsonSchema; nullable: boolean } {
  if (!schema.anyOf?.some((branch) => branch.type === "null")) return { inner: schema, nullable: false };
  const rest = schema.anyOf.filter((branch) => branch.type !== "null");
  const base = rest.length === 1 ? rest[0] : { anyOf: rest };
  return {
    nullable: true,
    inner: {
      ...base,
      title: schema.title ?? base.title,
      description: schema.description ?? base.description,
      widget: schema.widget ?? base.widget,
    },
  };
}

export function defaultFor(schema: JsonSchema): Value {
  const { inner, nullable } = splitNullable(schema);
  if (nullable) return null;
  if (inner.const !== undefined) return inner.const;
  if (inner.anyOf) return defaultFor(inner.anyOf[0]);
  if (inner.enum) return inner.enum[0];
  switch (inner.type) {
    case "object":
      return Object.fromEntries((inner.required ?? []).map((key) => [key, defaultFor(inner.properties![key])]));
    case "array":
      return [];
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return false;
    default:
      return "";
  }
}

function itemSummary(value: Value, index: number): string {
  if (typeof value === "string") return value || `Item ${index + 1}`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["title", "label", "name", "client", "platform", "text", "quote", "figure", "id", "youtubeId"]) {
      const text = record[key];
      if (typeof text === "string" && text.trim()) return text.length > 70 ? `${text.slice(0, 70)}…` : text;
    }
  }
  return `Item ${index + 1}`;
}

export function SchemaField({
  schema,
  value,
  onChange,
  path,
  name,
  onRemove,
}: {
  schema: JsonSchema;
  value: Value;
  onChange: Change;
  path: Path;
  name: string;
  onRemove?: () => void;
}) {
  const errors = useContext(ErrorsContext);
  const error = errors.get(path.join("."));
  const { inner, nullable } = splitNullable(schema);
  const title = inner.title ?? humanize(name);

  if (inner.widget === "icon" || schema.widget === "icon") {
    return (
      <FieldShell title={title} description={inner.description} error={error} onRemove={onRemove}>
        <IconField value={value as never} onChange={onChange} />
      </FieldShell>
    );
  }

  if (nullable && inner.type === "string") {
    return (
      <SchemaField
        schema={inner}
        value={value ?? ""}
        onChange={(next) => onChange(next === "" ? null : next)}
        path={path}
        name={name}
        onRemove={onRemove}
      />
    );
  }

  if (nullable) {
    const on = value !== null && value !== undefined;
    return (
      <div className="rounded-2xl border border-line p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{title}</p>
            {inner.description ? <p className="mt-1 text-sm text-paper/50">{inner.description}</p> : null}
          </div>
          <Toggle label={title} checked={on} onChange={(checked) => onChange(checked ? defaultFor(inner) : null)} />
        </div>
        {on ? (
          <div className="mt-4">
            <SchemaBody schema={inner} value={value} onChange={onChange} path={path} name={name} />
          </div>
        ) : null}
      </div>
    );
  }

  if (inner.type === "object" || inner.type === "array" || inner.anyOf) {
    return <SchemaBody schema={inner} value={value} onChange={onChange} path={path} name={name} onRemove={onRemove} titled={path.length > 0} />;
  }

  return (
    <FieldShell title={title} description={inner.description} error={error} onRemove={onRemove} htmlFor={fieldId(path)}>
      <Primitive schema={inner} value={value} onChange={onChange} id={fieldId(path)} />
    </FieldShell>
  );
}

function SchemaBody({
  schema,
  value,
  onChange,
  path,
  name,
  onRemove,
  titled,
}: {
  schema: JsonSchema;
  value: Value;
  onChange: Change;
  path: Path;
  name: string;
  onRemove?: () => void;
  titled?: boolean;
}) {
  const title = schema.title ?? humanize(name);

  if (schema.anyOf) return <UnionField schema={schema} value={value} onChange={onChange} path={path} title={title} />;

  if (schema.type === "array") {
    return (
      <ArrayField
        schema={schema}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        path={path}
        title={titled ? title : undefined}
      />
    );
  }

  const record = (value && typeof value === "object" ? value : {}) as Record<string, Value>;
  const required = new Set(schema.required ?? []);
  const entries = Object.entries(schema.properties ?? {});
  const missingOptional = entries.filter(([key]) => !required.has(key) && record[key] === undefined);
  const set = (key: string, next: Value) => onChange({ ...record, [key]: next });
  const unset = (key: string) => {
    const copy = { ...record };
    delete copy[key];
    onChange(copy);
  };

  const body = (
    <div className="grid gap-5 sm:grid-cols-2">
      {entries
        .filter(([key]) => required.has(key) || record[key] !== undefined)
        .map(([key, child]) => {
          const { inner } = splitNullable(child);
          const wide = inner.type === "object" || inner.type === "array" || inner.anyOf || inner.widget === "textarea" || inner.widget === "icon" || inner.widget === "image" || inner.widget === "file";
          return (
            <div key={key} className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
              <SchemaField
                schema={child}
                value={record[key]}
                onChange={(next) => set(key, next)}
                path={[...path, key]}
                name={key}
                onRemove={required.has(key) ? undefined : () => unset(key)}
              />
            </div>
          );
        })}
      {missingOptional.length ? (
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {missingOptional.map(([key, child]) => (
            <button
              key={key}
              type="button"
              onClick={() => set(key, defaultFor(child) ?? "")}
              className="min-h-9 rounded-full border border-dashed border-paper/25 px-3 text-[13px] text-paper/60 hover:border-paper/60 hover:text-paper"
            >
              + {splitNullable(child).inner.title ?? humanize(key)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (!titled) return body;
  return (
    <fieldset className="rounded-2xl border border-line p-4 sm:p-5">
      <legend className="flex items-center gap-3 px-2 text-sm font-medium text-paper/85">
        {title}
        {onRemove ? <RemoveButton onClick={onRemove} /> : null}
      </legend>
      {schema.description ? <p className="-mt-1 mb-4 text-sm text-paper/50">{schema.description}</p> : null}
      {body}
    </fieldset>
  );
}

function UnionField({ schema, value, onChange, path, title }: { schema: JsonSchema; value: Value; onChange: Change; path: Path; title: string }) {
  const variants = schema.anyOf ?? [];
  const record = (value && typeof value === "object" ? value : {}) as Record<string, Value>;
  const matches = (variant: JsonSchema) => (variant.required ?? []).every((key) => key in record);
  const index = Math.max(0, variants.findIndex(matches));
  const active = variants[index];

  const switchTo = (next: number) => {
    const fresh = defaultFor(variants[next]) as Record<string, Value>;
    for (const key of Object.keys(fresh)) if (key in record && typeof record[key] === typeof fresh[key]) fresh[key] = record[key];
    onChange(fresh);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] uppercase tracking-[0.14em] text-paper/50">{title}</span>
        {variants.map((variant, variantIndex) => (
          <button
            key={variantIndex}
            type="button"
            onClick={() => variantIndex !== index && switchTo(variantIndex)}
            aria-pressed={variantIndex === index}
            className={`min-h-8 rounded-full border px-3 text-[13px] ${
              variantIndex === index ? "border-lime bg-lime text-ink" : "border-paper/20 text-paper/65 hover:border-paper/50"
            }`}
          >
            {variant.title ?? `Option ${variantIndex + 1}`}
          </button>
        ))}
      </div>
      {active ? <SchemaBody schema={active} value={value} onChange={onChange} path={path} name={title} /> : null}
    </div>
  );
}

let idCounter = 0;
const nextId = () => ++idCounter;

function ArrayField({ schema, value, onChange, path, title }: { schema: JsonSchema; value: Value[]; onChange: Change; path: Path; title?: string }) {
  const itemSchema = schema.items ?? {};
  const [storedIds, setIds] = useState<number[]>(() => value.map(() => nextId()));
  let ids = storedIds;
  if (ids.length !== value.length) {
    ids = value.map((_, index) => storedIds[index] ?? nextId());
    setIds(ids);
  }
  const [open, setOpen] = useState<Set<number>>(new Set());
  const complex = itemSchema.type === "object" || Boolean(itemSchema.anyOf);

  const commit = (next: Value[], nextIds: number[]) => {
    setIds(nextIds);
    onChange(next);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const nextIds = [...ids];
    [next[from], next[to]] = [next[to], next[from]];
    [nextIds[from], nextIds[to]] = [nextIds[to], nextIds[from]];
    commit(next, nextIds);
  };
  const remove = (index: number) => {
    if (complex && !window.confirm(`Remove “${itemSummary(value[index], index)}”?`)) return;
    commit(
      value.filter((_, i) => i !== index),
      ids.filter((_, i) => i !== index),
    );
  };
  const add = () => {
    const id = nextId();
    commit([...value, defaultFor(itemSchema)], [...ids, id]);
    setOpen((current) => new Set(current).add(id));
  };
  const toggle = (id: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const itemLabel = itemSchema.title ?? "item";
  const itemName = itemSchema.title ?? (title ? title.replace(/ies$/, "y").replace(/([^s])s$/, "$1") : "Item");
  const errors = useContext(ErrorsContext);

  return (
    <div className="flex flex-col gap-3">
      {title ? (
        <div>
          <p className="text-sm font-medium text-paper/85">
            {title} <span className="text-paper/40">({value.length})</span>
          </p>
          {schema.description ? <p className="mt-1 text-sm text-paper/50">{schema.description}</p> : null}
        </div>
      ) : null}

      {value.map((item, index) => {
        const id = ids[index];
        const controls = (
          <div className="flex shrink-0 items-center gap-0.5">
            <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
              ↑
            </IconButton>
            <IconButton label="Move down" disabled={index === value.length - 1} onClick={() => move(index, index + 1)}>
              ↓
            </IconButton>
            <IconButton label="Remove" onClick={() => remove(index)} danger>
              ×
            </IconButton>
          </div>
        );

        if (!complex) {
          const error = errors.get([...path, index].join("."));
          return (
            <div key={id} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <Primitive
                  schema={itemSchema}
                  value={item}
                  onChange={(next) => onChange(value.map((current, i) => (i === index ? next : current)))}
                  id={fieldId([...path, index])}
                  label={`${itemName} ${index + 1}`}
                />
                {error ? <p className="mt-1.5 text-sm text-[#e2b1a8]">{error}</p> : null}
              </div>
              {controls}
            </div>
          );
        }

        const itemKey = [...path, index].join(".");
        const hasError = [...errors.keys()].some((key) => key === itemKey || key.startsWith(`${itemKey}.`));
        const isOpen = open.has(id) || hasError;
        return (
          <div key={id} className="rounded-2xl border border-line bg-white/[0.015]">
            <div className="flex items-center gap-2 py-1.5 pl-4 pr-2">
              <button type="button" onClick={() => toggle(id)} aria-expanded={isOpen} className="flex min-h-10 min-w-0 flex-1 items-center gap-3 text-left">
                <span className={`text-paper/40 transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden>
                  ›
                </span>
                <span className="text-[12px] tabular-nums text-paper/40">{String(index + 1).padStart(2, "0")}</span>
                <span className="truncate text-[15px]">{itemSummary(item, index)}</span>
                {hasError ? <span className="shrink-0 text-[12px] text-[#e2b1a8]">Needs a fix</span> : null}
              </button>
              {controls}
            </div>
            {isOpen ? (
              <div className="border-t border-line p-4 sm:p-5">
                <SchemaBody
                  schema={itemSchema}
                  value={item}
                  onChange={(next) => onChange(value.map((current, i) => (i === index ? next : current)))}
                  path={[...path, index]}
                  name={itemLabel}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="min-h-10 self-start rounded-full border border-dashed border-paper/30 px-4 text-sm text-paper/70 hover:border-lime hover:text-lime"
      >
        + Add {itemName.toLowerCase()}
      </button>
    </div>
  );
}

function Primitive({ schema, value, onChange, id, label }: { schema: JsonSchema; value: Value; onChange: Change; id: string; label?: string }) {
  if (schema.type === "boolean") return <Toggle id={id} checked={Boolean(value)} onChange={onChange} />;

  if (schema.type === "number" || schema.type === "integer") {
    return (
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={schema.type === "integer" ? 1 : "any"}
        min={schema.minimum}
        max={schema.maximum}
        value={typeof value === "number" && Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        className={input}
      />
    );
  }

  if (schema.enum) {
    return (
      <select id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={input}>
        {schema.enum.map((option) => (
          <option key={option} value={option}>
            {humanize(option)}
          </option>
        ))}
      </select>
    );
  }

  const text = typeof value === "string" ? value : "";

  if (schema.widget === "image" || schema.widget === "file") {
    return <MediaField value={text} onChange={onChange} kind={schema.widget} />;
  }

  if (schema.widget === "color") {
    return (
      <div className="flex gap-2">
        <input
          type="color"
          aria-label="Pick a color"
          value={/^#[0-9a-f]{6}$/i.test(text) ? text : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="h-[46px] w-14 shrink-0 cursor-pointer rounded-xl border border-paper/15 bg-ink p-1"
        />
        <input id={id} value={text} onChange={(event) => onChange(event.target.value)} className={input} />
      </div>
    );
  }

  if (schema.widget === "textarea") {
    return (
      <textarea
        id={id}
        aria-label={label}
        value={text}
        rows={Math.min(10, Math.max(3, Math.ceil(text.length / 90)))}
        onChange={(event) => onChange(event.target.value)}
        className={`${input} resize-y leading-relaxed`}
      />
    );
  }

  return <input id={id} aria-label={label} value={text} onChange={(event) => onChange(event.target.value)} className={input} />;
}

const fieldId = (path: Path) => ["field", ...path].join("-");

function FieldShell({
  title,
  description,
  error,
  onRemove,
  htmlFor,
  children,
}: {
  title: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClass}>
            {title}
          </label>
        ) : (
          <span className={labelClass}>{title}</span>
        )}
        {onRemove ? <RemoveButton onClick={onRemove} /> : null}
      </div>
      {children}
      {description ? <p className="mt-1.5 text-[13px] text-paper/45">{description}</p> : null}
      {error ? <p className="mt-1.5 text-[13px] text-[#e2b1a8]">{error}</p> : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-lime" : "bg-paper/20"}`}
    >
      <span className={`h-5 w-5 rounded-full bg-ink shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-[12px] text-paper/40 hover:text-[#e2b1a8]">
      Remove
    </button>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-full text-base text-paper/55 transition-colors disabled:opacity-25 ${
        danger ? "hover:bg-[#e2b1a8]/15 hover:text-[#e2b1a8]" : "hover:bg-white/[0.06] hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}
