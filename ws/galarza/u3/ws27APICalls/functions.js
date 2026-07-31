document.addEventListener("DOMContentLoaded", () => {
    const countryInput = document.getElementById("countryInput");
    const countryForm = document.getElementById("countryForm");
    const searchInput = document.getElementById("search");
    const noResults = document.getElementById("noResults");

    const validCountries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
        "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
        "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
        "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", 
        "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
        "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", 
        "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
        "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
        "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
        "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", 
        "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", 
        "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
        "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", 
        "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
        "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", 
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
        "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", 
        "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", 
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
        "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", 
        "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
        "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkiye", 
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
        "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    if (countryInput && countryForm) {
        countryInput.removeAttribute("list");
        countryInput.setAttribute("autocomplete", "off");
        const dropdown = document.createElement("div");
        dropdown.id = "customCountryDropdown";
        dropdown.style.position = "absolute";
        dropdown.style.background = "#1e293b"; 
        dropdown.style.border = "1px solid #334155";
        dropdown.style.borderRadius = "8px";
        dropdown.style.maxHeight = "220px";
        dropdown.style.overflowY = "auto";
        dropdown.style.zIndex = "9999";
        dropdown.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.3)";
        dropdown.style.display = "none";
        dropdown.style.marginTop = "4px";
        countryForm.style.position = "relative";
        countryForm.appendChild(dropdown);

        const syncWidth = () => { dropdown.style.width = countryInput.offsetWidth + "px"; };
        syncWidth();
        window.addEventListener("resize", syncWidth);

        countryInput.addEventListener("input", function() {
            const value = this.value.trim().toLowerCase();
            dropdown.innerHTML = ""; 

            if (!value) {
                dropdown.style.display = "none";
                return;
            }
            const matches = validCountries.filter(c => c.toLowerCase().includes(value)).sort();

            if (matches.length > 0) {
                dropdown.style.display = "block";
                matches.forEach(country => {
                    const item = document.createElement("div");
                    item.textContent = country;
                    item.style.padding = "10px 14px";
                    item.style.cursor = "pointer";
                    item.style.color = "#f8fafc";
                    item.style.transition = "background 0.2s";
                    item.addEventListener("mouseenter", () => item.style.background = "#334155");
                    item.addEventListener("mouseleave", () => item.style.background = "transparent");
                    item.addEventListener("click", () => {
                        countryInput.value = country;
                        dropdown.style.display = "none";
                        countryForm.submit();
                    });

                    dropdown.appendChild(item);
                });
            } else {
                dropdown.style.display = "none";
            }
        });

        document.addEventListener("click", (e) => {
            if (e.target !== countryInput && e.target !== dropdown) {
                dropdown.style.display = "none";
            }
        });
    }

    if (searchInput) {
        searchInput.setAttribute("autocomplete", "off");
        
        searchInput.addEventListener("input", function () {
            const filter = this.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const tableRows = document.querySelectorAll("#universitiesTable tbody tr:not(#emptyStateRow)");
            let visibleCount = 0;

            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                if (text.includes(filter)) {
                    row.style.display = ""; 
                    visibleCount++;
                } else {
                    row.style.display = "none"; 
                }
            });
            
            if (noResults) {
                if (visibleCount === 0 && tableRows.length > 0) {
                    noResults.classList.remove("hidden");
                } else {
                    noResults.classList.add("hidden");
                }
            }
        });
    }
});
