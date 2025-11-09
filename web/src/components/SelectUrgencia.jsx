import React from "react";
import Select from "react-select";

const options = [
    { value: "baixo", label: "Baixo" },
    { value: "médio", label: "Médio" },
    { value: "alto", label: "Alto" },
];

export default function SelectUrgencia({ value, onChange }) {
    return (
        <Select
            value={options.find((o) => o.value === value)}
            onChange={(selected) => onChange(selected.value)}
            options={options}
            placeholder="Selecione a urgência"
            styles={{
                control: (base) => ({
                    ...base,
                    borderRadius: "12px",
                    color: "#fff !important",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "none",
                    background: "var(--grad-azul-raf)",
                    "&:hover": { borderColor: "var(--azul-claro)" },

                }),
                menu: (base) => ({
                    ...base,
                    borderRadius: "12px",
                    padding: "4px",
                    backgroundColor: "var(--azul-bondi)",
                    zIndex: 9999,

                }),
                option: (base, state) => ({
                    ...base,
                    borderRadius: "8px",
                    backgroundColor: state.isFocused
                        ? "var(--azul-claro)"
                        : state.isSelected
                            ? "var(--azul-raf)"
                            : "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    padding: "8px 12px",
                }),
            }}
        />
    );
}
