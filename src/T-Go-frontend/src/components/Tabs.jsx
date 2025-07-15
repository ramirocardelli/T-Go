export function Tabs({ value, onValueChange, className, children }) {
  return (
    <div className={classNames(styles.tabs, className)} data-value={value}>
      {/* Tabs Context could be added if needed */}
      {children}
    </div>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={`${styles.tabsList} ${className ?? ""}`}>{children}</div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const parent = document.querySelector("[data-value]");
  const activeValue = parent?.getAttribute("data-value");
  const isActive = activeValue === value;

  const handleClick = () => {
    if (parent) {
      const event = new CustomEvent("tab-change", { detail: value });
      parent.dispatchEvent(event);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ""} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
