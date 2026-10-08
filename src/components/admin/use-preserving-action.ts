"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React 19 resets uncontrolled forms after an `action` submission. For admin forms we
 * want user input preserved when the server returns validation errors, so submit manually.
 */
export function preservingSubmit(dispatch: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
