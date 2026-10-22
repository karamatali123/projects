"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label className="block text-sm">
        Name
        <input
          name="name"
          required
          autoComplete="name"
          className="mt-1 h-11 w-full rounded-lg border border-stroke bg-ink px-3 text-paper"
        />
      </label>
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 h-11 w-full rounded-lg border border-stroke bg-ink px-3 text-paper"
        />
      </label>
      <label className="block text-sm">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-stroke bg-ink px-3 py-2 text-paper"
        />
      </label>
      <button
        type="submit"
        className="h-11 cursor-pointer rounded-full bg-paper px-5 text-sm font-semibold text-ink"
      >
        Submit
      </button>
      {sent ? (
        <p role="status" className="text-sm text-mist">
          This site has no message server, so nothing was sent or stored. The note stayed in this form and is gone
          when you leave the page.
        </p>
      ) : null}
    </form>
  );
}
