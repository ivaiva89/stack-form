import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StackFormProvider, TextField, NumberField, TextareaField, SelectField, CheckboxField, SwitchField, RadioGroupField, } from '@stackform/ui';
import { RHFFormProvider } from '@stackform/rhf';
// ─── Custom slot components for the Slot Override demo ───────────────────────
function CustomLabel({ htmlFor, children, required }) {
    return (_jsxs("label", { htmlFor: htmlFor, className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-600", children: [children, required && _jsx("span", { className: "ml-1 text-red-500", children: "*" })] }));
}
function CustomError({ id, message }) {
    return (_jsxs("p", { id: id, role: "alert", className: "mt-1 flex items-center gap-1 text-xs font-medium text-red-600", children: [_jsx("span", { "aria-hidden": "true", children: "\u26A0" }), message] }));
}
// ─── Shared country + contact options ────────────────────────────────────────
const COUNTRIES = [
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
];
const CONTACT_OPTIONS = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'post', label: 'Post' },
];
function RegistrationPage() {
    const form = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            age: 0,
            bio: '',
            country: '',
            agreeTerms: false,
            newsletter: false,
            contactMethod: '',
        },
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        const values = form.getValues();
        let hasErrors = false;
        if (!values.fullName.trim()) {
            form.setError('fullName', { message: 'Full name is required' });
            hasErrors = true;
        }
        else {
            form.clearErrors('fullName');
        }
        if (!values.email.trim()) {
            form.setError('email', { message: 'Email is required' });
            hasErrors = true;
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            form.setError('email', { message: 'Enter a valid email address' });
            hasErrors = true;
        }
        else {
            form.clearErrors('email');
        }
        if (!values.country) {
            form.setError('country', { message: 'Please select a country' });
            hasErrors = true;
        }
        else {
            form.clearErrors('country');
        }
        if (!values.agreeTerms) {
            form.setError('agreeTerms', { message: 'You must agree to the terms' });
            hasErrors = true;
        }
        else {
            form.clearErrors('agreeTerms');
        }
        if (!values.contactMethod) {
            form.setError('contactMethod', { message: 'Please choose a contact method' });
            hasErrors = true;
        }
        else {
            form.clearErrors('contactMethod');
        }
        if (!hasErrors) {
            setSubmitSuccess(true);
        }
    }
    if (submitSuccess) {
        return (_jsxs("div", { className: "rounded-lg border border-green-200 bg-green-50 p-6 text-center", children: [_jsx("p", { className: "text-lg font-semibold text-green-700", children: "Registration complete!" }), _jsxs("p", { className: "mt-1 text-sm text-green-600", children: ["Submitted: ", form.getValues('fullName'), " \u2014 ", form.getValues('email')] }), _jsx("button", { className: "mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700", onClick: () => {
                        form.reset();
                        setSubmitSuccess(false);
                    }, children: "Reset" })] }));
    }
    return (_jsx(StackFormProvider, { children: _jsx(RHFFormProvider, { form: form, children: _jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-5", children: [_jsx(TextField, { name: "fullName", label: "Full name", placeholder: "Jane Smith", required: true }), _jsx(TextField, { name: "email", label: "Email address", type: "email", placeholder: "jane@example.com", hint: "We'll never share your email.", required: true }), _jsx(NumberField, { name: "age", label: "Age", min: 18, max: 120, hint: "Must be 18 or older to register." }), _jsx(TextareaField, { name: "bio", label: "Bio", placeholder: "Tell us a little about yourself\u2026", maxLength: 300, showCount: true, hint: "Optional \u2014 up to 300 characters." }), _jsx(SelectField, { name: "country", label: "Country", placeholder: "Select a country", options: COUNTRIES, required: true }), _jsx(RadioGroupField, { name: "contactMethod", label: "Preferred contact method", options: CONTACT_OPTIONS, required: true }), _jsx(SwitchField, { name: "newsletter", label: "Subscribe to newsletter", hint: "You can unsubscribe at any time." }), _jsx(CheckboxField, { name: "agreeTerms", label: "I agree to the terms and conditions", required: true }), _jsx("button", { type: "submit", className: "w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900", children: "Create account" }), _jsx("p", { className: "text-center text-xs text-slate-500", children: "Submit the empty form to see validation errors." })] }) }) }));
}
// ─── Page 2 — Loading / skeleton state ───────────────────────────────────────
function LoadingPage() {
    const form = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            age: 0,
            bio: '',
            country: '',
            contactMethod: '',
            newsletter: false,
            agreeTerms: false,
        },
    });
    return (_jsx(StackFormProvider, { children: _jsx(RHFFormProvider, { form: form, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("p", { className: "text-sm text-slate-500", children: ["All fields below are in ", _jsx("code", { className: "rounded bg-slate-100 px-1 py-0.5 text-xs", children: "loading=true" }), " state \u2014 the input is replaced with a shimmer skeleton."] }), _jsx(TextField, { name: "fullName", label: "Full name", loading: true }), _jsx(TextField, { name: "email", label: "Email address", loading: true }), _jsx(NumberField, { name: "age", label: "Age", loading: true }), _jsx(TextareaField, { name: "bio", label: "Bio", loading: true }), _jsx(SelectField, { name: "country", label: "Country", options: COUNTRIES, loading: true }), _jsx(RadioGroupField, { name: "contactMethod", label: "Preferred contact method", options: CONTACT_OPTIONS, loading: true }), _jsx(SwitchField, { name: "newsletter", label: "Subscribe to newsletter", loading: true }), _jsx(CheckboxField, { name: "agreeTerms", label: "I agree to the terms", loading: true })] }) }) }));
}
// ─── Page 3 — Slot override demo ─────────────────────────────────────────────
function SlotOverridePage() {
    const form = useForm({
        defaultValues: {
            username: '',
            role: '',
            bio: '',
        },
    });
    function handleSubmit(e) {
        e.preventDefault();
        const values = form.getValues();
        if (!values.username.trim()) {
            form.setError('username', { message: 'Username cannot be blank' });
            return;
        }
        form.clearErrors('username');
        if (!values.role) {
            form.setError('role', { message: 'Please choose a role' });
            return;
        }
        form.clearErrors('role');
    }
    const customSlots = {
        Label: CustomLabel,
        Error: CustomError,
    };
    return (_jsx(StackFormProvider, { children: _jsx(RHFFormProvider, { form: form, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700", children: [_jsx("strong", { children: "What this shows:" }), " the ", _jsx("code", { className: "rounded bg-indigo-100 px-1 text-xs", children: "Label" }), " and", ' ', _jsx("code", { className: "rounded bg-indigo-100 px-1 text-xs", children: "Error" }), " slots are replaced with custom components via the ", _jsx("code", { className: "rounded bg-indigo-100 px-1 text-xs", children: "slots" }), " prop on each field."] }), _jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-5", children: [_jsx(TextField, { name: "username", label: "Username", placeholder: "janedoe", required: true, slots: customSlots }), _jsx(SelectField, { name: "role", label: "Role", placeholder: "Choose a role", options: [
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'editor', label: 'Editor' },
                                    { value: 'viewer', label: 'Viewer' },
                                ], required: true, slots: customSlots }), _jsx(TextareaField, { name: "bio", label: "Bio", placeholder: "Optional\u2026", maxLength: 200, showCount: true, slots: customSlots }), _jsx("button", { type: "submit", className: "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700", children: "Save profile" }), _jsx("p", { className: "text-xs text-slate-500", children: "Submit empty to see the custom error style." })] })] }) }) }));
}
const PAGES = [
    { id: 'registration', label: 'Registration' },
    { id: 'loading', label: 'Loading state' },
    { id: 'slots', label: 'Slot override' },
];
// ─── Root ─────────────────────────────────────────────────────────────────────
export function App() {
    const [page, setPage] = useState('registration');
    return (_jsxs("div", { className: "mx-auto max-w-lg px-4 py-10", children: [_jsx("h1", { className: "mb-2 text-2xl font-bold text-slate-900", children: "StackForm + React Hook Form" }), _jsx("p", { className: "mb-8 text-sm text-slate-500", children: "Reference app demonstrating all 7 Tier 1 field components." }), _jsx("nav", { className: "mb-8 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1", "aria-label": "Demo sections", children: PAGES.map(({ id, label }) => (_jsx("button", { onClick: () => setPage(id), "aria-current": page === id ? 'page' : undefined, className: [
                        'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                        page === id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700',
                    ].join(' '), children: label }, id))) }), page === 'registration' && _jsx(RegistrationPage, {}), page === 'loading' && _jsx(LoadingPage, {}), page === 'slots' && _jsx(SlotOverridePage, {})] }));
}
