/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import * as m from '../../paraglide/messages'

export default function ContactForm() {
  // We'll use a string for status to manage the UI states
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      setStatus('submitting')

      try {
        // 1. Combine TanStack's form values with your Web3Forms access key
        const payload = {
          ...value,
          access_key: '7797accc-02b3-45bd-989d-8a7828d405f7',
        }

        // 2. Send as JSON to the Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        // 3. Handle the response based on Web3Forms' success boolean
        if (data.success) {
          setStatus('success')
          form.reset()
        } else {
          console.error('Web3Forms Error:', data)
          setStatus('error')
        }
      } catch (error) {
        console.error('Submission failed:', error)
        setStatus('error')
      }
    },
  })

  if (status === 'success') {
    return <p>{m.contact_form_confirmation_message()}</p>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-2 glass_effect p-10"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => (!value ? 'Name is required' : undefined),
        }}
        children={(field) => (
          <div>
            <label
              className="font-display label-medium text-on-surface-variant"
              htmlFor={field.name}
            >
              {m.contact_form_name()}
            </label>
            <input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="border border-outline-variant p-1 w-full"
            />
            {field.state.meta.errors && (
              <span style={{ color: 'red', fontSize: '0.8rem' }}>
                {field.state.meta.errors.join(', ')}
              </span>
            )}
          </div>
        )}
      />

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Email is required'
              : !/^\S+@\S+\.\S+$/.test(value)
                ? 'Invalid email format'
                : undefined,
        }}
        children={(field) => (
          <div>
            <label
              className="font-display label-medium text-on-surface-variant"
              htmlFor={field.name}
            >
              {m.contact_form_email()}
            </label>
            <input
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="border border-outline-variant p-1 w-full"
            />
            {field.state.meta.errors && (
              <span style={{ color: 'red', fontSize: '0.8rem' }}>
                {field.state.meta.errors.join(', ')}
              </span>
            )}
          </div>
        )}
      />

      <form.Field
        name="message"
        validators={{
          onChange: ({ value }) => (!value ? 'Message is required' : undefined),
        }}
        children={(field) => (
          <div>
            <label
              className="font-display label-medium text-on-surface-variant"
              htmlFor={field.name}
            >
              {m.contact_form_body()}
            </label>
            <textarea
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={4}
              className="border border-outline-variant p-1 w-full"
            />
            {field.state.meta.errors && (
              <span style={{ color: 'red', fontSize: '0.8rem' }}>
                {field.state.meta.errors.join(', ')}
              </span>
            )}
          </div>
        )}
      />

      {status === 'error' && (
        <p style={{ color: 'red' }}>Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-primary-container p-1 w-1/4 self-end"
      >
        {status === 'submitting' ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
