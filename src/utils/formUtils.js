export const limpiarForm = (form) => {
    return Object.fromEntries(
        Object.entries(form).map(([key, val]) => [
            key, typeof val === "string" ? val.trim() : val
        ])
    );
};