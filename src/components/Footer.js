import Order from "./Order";

export default function Footer() {
  const currentTime = new Date().getHours();

  return (
    <footer className="footer">
      <Order currentTime={currentTime} />
    </footer>
  );
}
