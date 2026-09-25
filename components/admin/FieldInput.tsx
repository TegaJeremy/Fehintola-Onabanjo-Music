"use client";

import { locales, localeNames } from "@/i18n/routing";
import type { Field } from "./resources";
import ImageUpload from "./ImageUpload";

export const inputCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent";

type Value = unknown;

/** Converts a saved date to what <input type="datetime-local"> expects. */
function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: Value;
  onChange: (v: Value) => void;
}) {
  const id = `f-${field.name}`;

  const label = (
    <span className="mb-1.5 block text-sm font-medium">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </span>
  );
  const help = field.help && (
    <span className="mt-1 block text-xs text-muted">{field.help}</span>
  );

  if (field.type === "i18n" || field.type === "i18n-textarea") {
    const v = (value as Record<string, string>) || {};
    return (
      <fieldset>
        {label}
        <div className="space-y-2 rounded-xl border border-line p-3">
          {locales.map((l) => (
            <label key={l} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
              <span className="w-20 shrink-0 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {localeNames[l]}
                {l === "en" && field.required && <span className="text-red-500"> *</span>}
              </span>
              {field.type === "i18n" ? (
                <input
                  className={inputCls}
                  value={v[l] ?? ""}
                  required={l === "en" && field.required}
                  placeholder={l === "en" ? "" : "Optional – English is used if empty"}
                  onChange={(e) => onChange({ ...v, [l]: e.target.value })}
                />
              ) : (
                <textarea
                  rows={l === "en" ? 5 : 3}
                  className={inputCls}
                  value={v[l] ?? ""}
                  required={l === "en" && field.required}
                  placeholder={l === "en" ? "" : "Optional – English is used if empty"}
                  onChange={(e) => onChange({ ...v, [l]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        {help}
      </fieldset>
    );
  }

  if (field.type === "image") {
    return (
      <div>
        {label}
        <ImageUpload value={(value as string) || ""} onChange={onChange} />
        {help}
      </div>
    );
  }

  let input: React.ReactNode;
  const str = value == null ? "" : String(value);

  switch (field.type) {
    case "textarea":
      input = (
        <textarea
          id={id}
          rows={4}
          className={inputCls}
          value={str}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "select":
      input = (
        <select
          id={id}
          className={inputCls}
          value={str}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Choose…</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "datetime":
      input = (
        <input
          id={id}
          type="datetime-local"
          className={inputCls}
          value={toLocalInput(str)}
          required={field.required}
          onChange={(e) =>
            onChange(e.target.value ? new Date(e.target.value).toISOString() : "")
          }
        />
      );
      break;
    case "number":
      input = (
        <input
          id={id}
          type="number"
          className={inputCls}
          value={str}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      );
      break;
    default:
      input = (
        <input
          id={id}
          type={field.type === "url" ? "url" : field.type === "date" ? "date" : "text"}
          className={inputCls}
          value={field.type === "date" ? str.slice(0, 10) : str}
          placeholder={field.placeholder ?? (field.type === "url" ? "https://" : "")}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <label htmlFor={id} className="block">
      {label}
      {input}
      {help}
    </label>
  );
}
