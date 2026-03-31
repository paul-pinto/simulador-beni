export const Slider = ({ value, onValueChange, ...props }) => (
  <input
    type="range"
    value={value[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    {...props}
  />
);