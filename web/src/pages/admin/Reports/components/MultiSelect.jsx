import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";

export default function MultiSelect({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = "Buscar...",
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.nome.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeTag = (id) => {
    onChange(selected.filter((s) => s !== id));
  };

  const selectedNames = options
    .filter((opt) => selected.includes(opt.id))
    .map((opt) => opt.nome);

  return (
    <div className="multi-select" ref={wrapperRef}>
      <label className="multi-select-label">{label}</label>

      <div className="multi-select-input" onClick={() => setIsOpen(!isOpen)}>
        <div className="multi-select-tags">
          {selectedNames.length > 0 ? (
            selectedNames.map((name, idx) => (
              <span key={idx} className="multi-select-tag">
                {name}
                <button
                  type="button"
                  className="multi-select-tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = options.find((o) => o.nome === name)?.id;
                    if (id) removeTag(id);
                  }}
                >
                  <XCircleIcon size={14} weight="fill" />
                </button>
              </span>
            ))
          ) : (
            <span className="multi-select-placeholder">{placeholder}</span>
          )}
        </div>
        <span className="multi-select-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="multi-select-dropdown">
          <div className="multi-select-search">
            <MagnifyingGlassIcon size={16} />
            <input
              type="text"
              placeholder="Filtrar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="multi-select-options">
            {loading ? (
              <div className="multi-select-loading">Carregando...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="multi-select-empty">Nenhum resultado</div>
            ) : (
              filteredOptions.map((opt) => (
                <label key={opt.id} className="multi-select-option">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.id)}
                    onChange={() => toggleOption(opt.id)}
                  />
                  {opt.nome}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
