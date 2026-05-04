function Campo_input_form({ label, type, id, name, valor, onChange }) {
    return (
        <div className="campo">
            <label htmlFor={id}>{label}</label>
            <input type={type} id={id} name={name} value={valor} onChange={onChange} required />
        </div>
    )
}
export default Campo_input_form