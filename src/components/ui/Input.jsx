//input de login
const Input = ({ label, type = "text", name, value, onChange, disabled, required,...rest}) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...rest}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     text-gray-700 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-accent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition duration-200"
          
        />
      </div>
    );
  };
  
  export default Input;