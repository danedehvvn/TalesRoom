import { useEffect, useId, useRef, useState } from "react";
import { fetchSearchSuggestions } from "../api/searchApi";
import "../styles/SearchAutocomplete.css";

function SearchAutocomplete({
  type,
  name = "keyword",
  initialValue = "",
  placeholder,
  ariaLabel,
  onSelect,
}) {
  const [value, setValue] = useState(initialValue);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    const keyword = value.trim();

    if (!keyword) return undefined;

    let ignore = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (!ignore) setStatus("loading");

      try {
        const data = await fetchSearchSuggestions(keyword, controller.signal);

        if (ignore) return;

        const suggestions = type === "themes" ? data.themes : data.posts;
        setItems(suggestions || []);
        setStatus("success");
        setActiveIndex(-1);
      } catch (error) {
        if (ignore || error.code === "ERR_CANCELED") return;

        setItems([]);
        setStatus("error");
      }
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [type, value]);

  useEffect(() => {
    const form = inputRef.current?.form;

    if (!form) return undefined;

    const handleReset = () => {
      setValue(initialValue);
      setItems([]);
      setStatus("idle");
      setIsOpen(false);
      setActiveIndex(-1);
    };

    form.addEventListener("reset", handleReset);

    return () => {
      form.removeEventListener("reset", handleReset);
    };
  }, [initialValue]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    setItems([]);
    setActiveIndex(-1);

    if (nextValue.trim()) {
      setStatus("loading");
      setIsOpen(true);
    } else {
      setStatus("idle");
      setIsOpen(false);
    }
  };

  const selectSuggestion = (item) => {
    setValue(item.title);
    setItems([]);
    setStatus("idle");
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(item.title, item);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current < items.length - 1 ? current + 1 : 0));
    }

    if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current > 0 ? current - 1 : items.length - 1));
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(items[activeIndex]);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="search-autocomplete">
      <input
        ref={inputRef}
        name={name}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.trim()) setIsOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 150);
        }}
      />

      {isOpen && value.trim() && (
        <div id={listId} className="search-autocomplete__menu" role="listbox">
          {status === "loading" && (
            <p className="search-autocomplete__state">추천 검색어를 불러오는 중입니다.</p>
          )}

          {status === "error" && (
            <p className="search-autocomplete__state">추천 검색어를 불러오지 못했습니다.</p>
          )}

          {status === "success" && items.length === 0 && (
            <p className="search-autocomplete__state">추천 검색어가 없습니다.</p>
          )}

          {status === "success" && items.map((item, index) => (
            <button
              id={`${listId}-${index}`}
              key={`${type}-${item.id}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={`search-autocomplete__item ${activeIndex === index ? "is-active" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(item)}
            >
              <span>{item.title}</span>
              <small>{type === "themes" ? "테마" : "게시글"}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;
