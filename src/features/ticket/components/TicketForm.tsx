import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { useTickets } from '../context/TicketContext';
import { TicketFormProps, TicketFormData } from '../type';

export default function TicketForm({
  isEditMode = false,
  initialData = null,
  onSuccess,
}: TicketFormProps) {

  const { register, reset, handleSubmit, formState: { errors } } = useForm<TicketFormData>({ mode: 'all' });
  const [description, setDescription] = useState('');
  const { loading, addTicket, updateTicket } = useTickets();


  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        description: initialData.description
      });
    } else {
      reset({
        description: '',
      });
    }
  }, [isEditMode, initialData, reset]);


  const handleClear = () => {
    setDescription(isEditMode && initialData ? initialData.description : '');
  };

  const handleSubmitData = (data: TicketFormData) => {
    const value = data.description.trim();
    if (!value) return;

    if (isEditMode && initialData) {
      updateTicket(initialData.id, { description: value });
      onSuccess?.(value);
    } else {
      addTicket(value);
      setDescription('');
    }
  };

  return (
    <section
      id="create-ticket"
      className="scroll-mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 sm:p-6"
    >
      {/* Heading */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
          ▤
        </span>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isEditMode ? 'Update Support Ticket' : 'Create a Support Ticket'}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditMode
              ? 'Edit the details below and save your changes.'
              : 'Fill in the details below to create a new ticket.'}
          </p>
        </div>

        {isEditMode && (
          <Link
            to="/"
            className="ml-auto text-sm text-blue-500 hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="flex w-full flex-col gap-3"
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <input
            {...register('description', { required: true })}
            type="text"
            placeholder="Enter ticket description..."
            value={description}
            name="description"
            onChange={(e) => {
              register('description').onChange(e);
              setDescription(e.target.value);
            }}
            aria-label="Ticket description"
            className="min-w-0 flex-1 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {isEditMode ? '✓' : '+'}
            </span>
            {isEditMode ? 'Update Ticket' : 'Create Ticket'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {isEditMode ? 'Reset' : 'Clear'}
          </button>
        </div>

        {errors.description && (
          <p className="w-full text-sm text-red-500 font-medium pl-1 mt-1">
            Description is required
          </p>
        )}
      </form>
    </section>
  );
}