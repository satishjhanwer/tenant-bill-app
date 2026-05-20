export function AppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M256 72L440 236V440H72V236L256 72Z"
        stroke="#c8a96e"
        strokeWidth="36"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="176" y1="316" x2="336" y2="316" stroke="#c8a96e" strokeWidth="28" strokeLinecap="round"/>
      <line x1="176" y1="362" x2="336" y2="362" stroke="#c8a96e" strokeWidth="28" strokeLinecap="round"/>
      <line x1="176" y1="408" x2="252" y2="408" stroke="#c8a96e" strokeWidth="28" strokeLinecap="round"/>
    </svg>
  );
}
