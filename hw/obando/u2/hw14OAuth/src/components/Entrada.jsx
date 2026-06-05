function CustomInput({ label, type = "text", value, onChange, placeholder, required = true }) {
    return (
        <>
            <label className="form-label-custom">{label}</label>
            <input 
                className="form-control-custom" 
                type={type} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder || label} 
                required={required} 
            />
        </>
    )
}

export default CustomInput