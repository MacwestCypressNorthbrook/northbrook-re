"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const inputCls =
  "w-full bg-white border border-wire text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"

const services = [
  { value: "ship-agency", label: "Ship Agency & Husbandry" },
  { value: "freight", label: "Air & Sea Freight" },
  { value: "bunkering", label: "Bunkering" },
  { value: "warehousing", label: "Warehousing & Cargo Consolidation" },
  { value: "documentation", label: "Import & Export Documentation" },
  { value: "crew-management", label: "Crew Management" },
  { value: "customs", label: "Customs Clearance" },
  { value: "haulage", label: "Haulage Services" },
  { value: "marine-technical", label: "Marine Technical Services" },
  { value: "general", label: "General Inquiry" },
]

interface FieldErrors {
  name?: string
  company?: string
  email?: string
  service?: string
  message?: string
  consent?: string
}

interface FormState {
  name: string
  company: string
  email: string
  phone: string
  service: string
  message: string
  consent: boolean
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (form.name.trim().length < 2) errors.name = "Full name is required"
  if (!form.company.trim()) errors.company = "Company name is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "A valid email address is required"
  if (!form.service) errors.service = "Please select a service"
  if (form.message.trim().length < 20) errors.message = "Message must be at least 20 characters"
  if (!form.consent) errors.consent = "You must agree to the privacy policy"
  return errors
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState<FormState>({
    name: "", company: "", email: "", phone: "", service: "", message: "", consent: false,
  })

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      // Static export has no Node runtime: production posts to the PHP mail
      // endpoint shipped in public/api/. The Next route only exists in dev.
      const endpoint = process.env.NODE_ENV === "development" ? "/api/contact" : "/api/contact.php"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      setSubmitted(true)
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        message: "Failed to send dispatch. Please retry or contact us directly at info@northbrook.com.gh",
      }))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-primary text-white p-8 text-center">
        <p className="font-display text-2xl font-light mb-3">
          Brief received.
        </p>
        <p className="text-white/60 text-sm">
          Thank you for reaching out. A member of our team will be in touch within one business day.
        </p>
      </div>
    )
  }

  const errMsg = (field: keyof FieldErrors) =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="text-red-500 text-xs mt-1">
        {errors[field]}
      </p>
    ) : null

  const labelCls = "block text-xs text-primary uppercase tracking-widest mb-1.5"
  const accentStar = <span className="text-accent">*</span>

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelCls}>
            Full Name {accentStar}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className={inputCls}
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errMsg("name")}
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>
            Company {accentStar}
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder="Acme Corp"
            className={inputCls}
            value={form.company}
            onChange={set("company")}
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
          />
          {errMsg("company")}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelCls}>
            Email {accentStar}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className={inputCls}
            value={form.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errMsg("email")}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 ..."
            className={inputCls}
            value={form.phone}
            onChange={set("phone")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={labelCls}>
          Service Interest {accentStar}
        </label>
        <select
          id="service"
          className={`${inputCls} cursor-pointer`}
          value={form.service}
          onChange={set("service")}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? "service-error" : undefined}
        >
          <option value="" disabled>Select a service</option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errMsg("service")}
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          Message {accentStar}
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe your logistics requirement..."
          className={`${inputCls} resize-none`}
          value={form.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errMsg("message")}
      </div>

      <div>
        <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
          <input
            id="consent"
            type="checkbox"
            className="mt-0.5 accent-accent"
            checked={form.consent}
            onChange={set("consent")}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span className="text-xs text-body leading-relaxed">
            I agree that my data is collected and stored in line with the{" "}
            <a href="/privacy" className="text-accent underline">Privacy Policy</a>.
          </span>
        </label>
        {errMsg("consent")}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full rounded-md py-4 h-auto text-sm font-semibold uppercase tracking-[0.12em]"
      >
        {submitting ? "Sending..." : "Send Brief"}
      </Button>
    </form>
  )
}
