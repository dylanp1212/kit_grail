import NumberSpinner from '../../components/NumberSpinner';

export default function SelectQuantity() {
  return (
    <NumberSpinner label="Quantity" min={0} max={40} />
  );
}
