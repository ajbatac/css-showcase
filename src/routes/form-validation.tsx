import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AlertCircle, Check, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/form-validation")({
  head: () => ({
    meta: [
      { title: "Form Validation — CSS Showcase" },
      {
        name: "description",
        content:
          "Form validation patterns — inline errors, error summaries, live password strength, and step-by-step flows — validated with zod and reshaped for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Form Validation — CSS Showcase" },
      {
        property: "og:description",
        content:
          "One sign-up form reshaped for mobile, iPad, and desktop with accessible, zod-backed validation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FormValidationDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "inline-errors" | "summary" | "live-strength" | "step-by-step";
type Field = "name" | "email" | "password";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "inline-errors", label: "Inline errors", desc: "Errors shown under each field" },
    { id: "summary", label: "Error summary", desc: "Summary block links to fields" },
    { id: "live-strength", label: "Live strength", desc: "Password meter + checklist" },
  ],
  ipad: [
    { id: "inline-errors", label: "Inline errors", desc: "Errors shown under each field" },
    { id: "summary", label: "Error summary", desc: "Summary block links to fields" },
  ],
  mobile: [
    { id: "step-by-step", label: "Step by step", desc: "One field per step" },
    { id: "inline-errors", label: "Inline errors", desc: "Errors shown under each field" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "inline-errors": `/* Inline field errors */
.field[data-invalid="true"] input {
  border-color: hsl(var(--destructive));
}

.field-error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: hsl(var(--destructive));
  font-size: 0.7rem;
}`,
  summary: `/* Error summary block */
.error-summary {
  border: 1px solid hsl(var(--destructive) / 0.4);
  background: hsl(var(--destructive) / 0.08);
  border-radius: 0.75rem;
}

.error-summary a {
  text-decoration: underline;
  text-underline-offset: 2px;
}`,
  "live-strength": `/* Live password strength meter */
.strength-meter {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
}

.strength-bar {
  height: 4px;
  border-radius: 999px;
  background: hsl(var(--border));
  transition: background-color 0.2s ease;
}

.strength-bar[data-active="true"] {
  background: var(--strength-color, hsl(var(--primary)));
}`,
  "step-by-step": `/* One field per step */
.step-wizard {
  display: grid;
  gap: 0.75rem;
}

.step-dots {
  display: flex;
  gap: 0.375rem;
}

.step-dot[data-active="true"] {
  background: hsl(var(--primary));
  width: 1.25rem;
}`,
};

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = { name: "", email: "", password: "" };

function fieldErrors(values: FormValues): Partial<Record<Field, string>> {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Partial<Record<Field, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as Field;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

const PASSWORD_RULES: { id: string; label: string; test: (v: string) => boolean }[] = [
  { id: "len", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "digit", label: "One number", test: (v) => /[0-9]/.test(v) },
  { id: "special", label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function passwordScore(v: string) {
  return PASSWORD_RULES.filter((r) => r.test(v)).length;
}

const STRENGTH_COLORS = [
  "hsl(var(--destructive))",
  "hsl(var(--destructive))",
  "#eab308",
  "hsl(var(--primary))",
];

function FormValidationDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "inline-errors",
      ipad: "inline-errors",
      mobile: "step-by-step",
    }),
  );
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const errors = useMemo(() => fieldErrors(values), [values]);
  const visibleErrors = (field: Field) => (touched[field] || submitted) && errors[field];

  const setField = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const blurField = (field: Field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const resetForm = () => {
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    setStep(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ name: true, email: true, password: true });
    const result = schema.safeParse(values);
    if (result.success) {
      setSuccess(true);
    }
  };

  const STEP_FIELDS: Field[] = ["name", "email", "password"];
  const currentField = STEP_FIELDS[step];
  const currentError = errors[currentField];

  const goNext = () => {
    setTouched((prev) => ({ ...prev, [currentField]: true }));
    if (currentError) return;
    if (step < STEP_FIELDS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const result = schema.safeParse(values);
      setSubmitted(true);
      if (result.success) setSuccess(true);
    }
  };

  const score = passwordScore(values.password);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Validation that guides you.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A sign-up form validated with a shared{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">zod</code> schema — inline
            errors, an error summary, a live password strength meter, and a mobile step-by-step
            flow.
          </p>
        </header>

        <section
          aria-labelledby="demo-title"
          className="overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id="demo-title" className="text-sm font-semibold">
              Featured demo
            </h2>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {device} · {pattern}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <div data-pattern={pattern} className="form-shell h-full w-full overflow-auto p-3">
                {success ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <p className="text-[11px] font-semibold">You're all set!</p>
                    <p className="text-[9px] text-muted-foreground">
                      Your account details look great.
                    </p>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-1 rounded-lg border border-border px-2.5 py-1 text-[9px] font-semibold hover:bg-accent"
                    >
                      Start over
                    </button>
                  </div>
                ) : pattern === "step-by-step" ? (
                  <form onSubmit={handleSubmit} className="step-wizard" noValidate>
                    <div className="step-dots" aria-hidden="true">
                      {STEP_FIELDS.map((f, i) => (
                        <span
                          key={f}
                          data-active={i === step}
                          className="step-dot h-1.5 w-1.5 rounded-full bg-border transition-all"
                        />
                      ))}
                    </div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {step + 1} of {STEP_FIELDS.length}
                    </p>
                    <FieldInput
                      field={currentField}
                      value={values[currentField]}
                      error={touched[currentField] || submitted ? currentError : undefined}
                      onChange={(v) => setField(currentField, v)}
                      onBlur={() => blurField(currentField)}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={step === 0}
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[9px] font-semibold disabled:opacity-30"
                      >
                        <ChevronLeft className="h-3 w-3" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[9px] font-semibold text-primary-foreground"
                      >
                        {step === STEP_FIELDS.length - 1 ? "Submit" : "Next"}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-2.5" noValidate>
                    {pattern === "summary" && submitted && Object.keys(errors).length > 0 && (
                      <div className="error-summary p-2.5" role="alert">
                        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-destructive">
                          <AlertCircle className="h-3 w-3" /> Please fix{" "}
                          {Object.keys(errors).length} error(s)
                        </p>
                        <ul className="grid gap-0.5 pl-4 text-[9px] text-destructive">
                          {(Object.keys(errors) as Field[]).map((f) => (
                            <li key={f}>
                              <a href={`#fv-${f}`} className="underline underline-offset-2">
                                {errors[f]}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <FieldInput
                      field="name"
                      value={values.name}
                      error={visibleErrors("name") || undefined}
                      onChange={(v) => setField("name", v)}
                      onBlur={() => blurField("name")}
                    />
                    <FieldInput
                      field="email"
                      value={values.email}
                      error={visibleErrors("email") || undefined}
                      onChange={(v) => setField("email", v)}
                      onBlur={() => blurField("email")}
                    />
                    <FieldInput
                      field="password"
                      type="password"
                      value={values.password}
                      error={visibleErrors("password") || undefined}
                      onChange={(v) => setField("password", v)}
                      onBlur={() => blurField("password")}
                    />

                    {pattern === "live-strength" && (
                      <div className="rounded-lg border border-border p-2">
                        <div
                          className="strength-meter"
                          style={{
                            ["--strength-color" as string]: STRENGTH_COLORS[Math.max(0, score - 1)],
                          }}
                        >
                          {[0, 1, 2, 3].map((i) => (
                            <span key={i} data-active={i < score} className="strength-bar" />
                          ))}
                        </div>
                        <ul className="mt-2 grid gap-1">
                          {PASSWORD_RULES.map((rule) => {
                            const passed = rule.test(values.password);
                            return (
                              <li
                                key={rule.id}
                                className={`flex items-center gap-1.5 text-[9px] ${
                                  passed ? "text-primary" : "text-muted-foreground"
                                }`}
                              >
                                <span
                                  className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                                    passed
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border"
                                  }`}
                                >
                                  {passed && <Check className="h-2 w-2" />}
                                </span>
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="mt-1 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground"
                    >
                      Create account
                    </button>
                  </form>
                )}
              </div>
            </DeviceFrame>
          </div>

          <div
            role="tablist"
            aria-label="Device viewport"
            className="grid grid-cols-3 gap-2 border-t bg-background/50 p-3"
          >
            {DEVICES.map((d) => {
              const active = device === d.id;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDevice(d.id)}
                  className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{d.label}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {d.hint}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <div role="tablist" aria-label="Design pattern" className="grid gap-2">
              {options.map((o) => {
                const active = pattern === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setPatterns((prev) => ({ ...prev, [device]: o.id }));
                      resetForm();
                    }}
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{o.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {o.desc}
                      </span>
                    </span>
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-border"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                form-validation-{pattern}.css
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(CSS_BY_PATTERN[pattern])}
                className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
              <code>{CSS_BY_PATTERN[pattern]}</code>
            </pre>
          </div>

          <div className="border-t px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• zod schema validation</li>
              <li>• aria-invalid / aria-describedby</li>
              <li>• Container queries</li>
              <li>• Live strength meter</li>
              <li>• Step-based wizard UI</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .form-shell {
          container-type: inline-size;
        }

        .field-error {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: hsl(var(--destructive));
          font-size: 0.65rem;
        }

        .error-summary {
          border: 1px solid hsl(var(--destructive) / 0.4);
          background: hsl(var(--destructive) / 0.08);
          border-radius: 0.75rem;
        }

        .strength-meter {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.25rem;
        }

        .strength-bar {
          height: 4px;
          border-radius: 999px;
          background: hsl(var(--border));
          transition: background-color 0.2s ease;
        }

        .strength-bar[data-active="true"] {
          background: var(--strength-color, hsl(var(--primary)));
        }

        .step-wizard {
          display: grid;
          gap: 0.75rem;
        }

        .step-dots {
          display: flex;
          gap: 0.375rem;
        }

        .step-dot {
          transition: width 0.2s ease, background-color 0.2s ease;
        }

        .step-dot[data-active="true"] {
          background: hsl(var(--primary));
          width: 1.25rem;
        }

        @container (min-width: 480px) {
          .form-shell[data-pattern="live-strength"] {
            padding-inline: 0.5rem;
          }
        }
      `}</style>
    </main>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
}: {
  field: Field;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  type?: string;
}) {
  const label = field === "name" ? "Full name" : field === "email" ? "Email address" : "Password";
  const id = `fv-${field}`;
  const errorId = `${id}-error`;

  return (
    <div className="field grid gap-1" data-invalid={!!error}>
      <label
        htmlFor={id}
        className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border bg-background px-2.5 py-1.5 text-[10px] outline-none transition-colors ${
          error ? "border-destructive" : "border-border focus:border-primary"
        }`}
      />
      {error && (
        <p id={errorId} className="field-error">
          <AlertCircle className="h-2.5 w-2.5" /> {error}
        </p>
      )}
    </div>
  );
}

function DeviceFrame({ device, children }: { device: Device; children: React.ReactNode }) {
  const style: Record<Device, React.CSSProperties> = {
    desktop: { aspectRatio: "16 / 10", maxWidth: "100%", borderRadius: "0.75rem" },
    ipad: { aspectRatio: "4 / 3", maxWidth: "88%", borderRadius: "1.5rem" },
    mobile: { aspectRatio: "9 / 19.5", maxWidth: "220px", borderRadius: "2rem" },
  };

  return (
    <div
      data-device={device}
      style={{
        ...style[device],
        containerType: "inline-size",
        transition:
          "aspect-ratio .5s ease, max-width .5s ease, border-radius .5s ease, padding .5s ease",
      }}
      className="relative mx-auto w-full overflow-hidden border-4 border-foreground/80 bg-background p-2 shadow-2xl"
    >
      {device === "mobile" && (
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/70" />
      )}
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}
