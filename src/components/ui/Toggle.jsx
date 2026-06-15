const Toggle = ({ label, name, checked, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange({ target: { name, value: checked ? "INACTIVE" : "ACTIVE" } })}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200
                        ${checked ? 'bg-celestevr' : 'bg-gray-300'}
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                        transition-transform duration-200
                        ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
                <span className="text-sm text-gray-700">
                    {checked ? "Activo" : "Inactivo"}
                </span>
            </div>
        </div>
    );
};

export default Toggle;