import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { StackFormProvider, TextField } from '@stackform/ui';
import { RHFFormProvider } from '@stackform/rhf';
export function App() {
    const form = useForm({
        defaultValues: { email: '', name: '' },
    });
    const onSubmit = (data) => {
        console.log('Submitted:', data);
    };
    return (_jsxs("div", { className: "mx-auto max-w-md p-8", children: [_jsx("h1", { className: "mb-6 text-2xl font-bold", children: "StackForm + React Hook Form" }), _jsx(StackFormProvider, { children: _jsx(RHFFormProvider, { form: form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(TextField, { name: "name", label: "Name", placeholder: "Your name" }), _jsx(TextField, { name: "email", label: "Email", type: "email", placeholder: "you@example.com", hint: "We'll never share your email." }), _jsx("button", { type: "submit", className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Submit" })] }) }) })] }));
}
