document.addEventListener("DOMContentLoaded", function() {
    var elements = document.querySelectorAll("input, select");
    elements.forEach(function(el) {
        el.addEventListener("invalid", function(e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                if (e.target.validity.valueMissing) {
                    e.target.setCustomValidity("Please fill out this field.");
                } else if (e.target.validity.rangeUnderflow) {
                    e.target.setCustomValidity("Price must be greater than or equal to 0.");
                } else if (e.target.validity.typeMismatch || e.target.validity.badInput) {
                    e.target.setCustomValidity("Invalid input.");
                }
            }
        });
        el.addEventListener("input", function(e) {
            e.target.setCustomValidity("");
        });
        el.addEventListener("change", function(e) {
            e.target.setCustomValidity("");
        });
    });
});
