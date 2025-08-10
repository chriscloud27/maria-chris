
export const Arrival = () => {
  return (
    <section id="arrival" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-8">How to Get to Guatapé, Antioquia, Colombia</h2>

      {/* By Flight */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-2">By Flight</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Fly to José María Córdova International Airport (MDE)</strong> – located near Rionegro, about 1 hour from Medellín.
          </li>
          <li>
            From the airport, you can take a shuttle or taxi to Medellín, then continue to Guatapé by bus, private driver, or rental car.
          </li>
          <li>
            No direct flights to Guatapé exist – Medellín remains the main entry point.
          </li>
        </ul>
      </div>

      {/* By Car */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-2">By Car</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Distance from Medellín:</strong> ~66 km (≈ 1h 40m drive)</li>
          <li>Flexible and quick option – just be aware of curvy mountain roads.</li>
        </ul>
      </div>

      {/* By Public Transport */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-2">By Public Transport</h3>
        <h4 className="text-lg font-medium mt-2">Bus from Medellín</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Depart from <strong>Terminal del Norte</strong> (reachable via Metro Line A, Caribe station).</li>
          <li><strong>Travel time:</strong> 1.5–2 hours</li>
          <li>Runs hourly and drops you off directly in Guatapé.</li>
        </ul>

        <h4 className="text-lg font-medium mt-4">Tour, Taxi, or Private Driver</h4>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Group Tours:</strong> Often include boat ride, guide, lunch.</li>
          <li><strong>Taxi / Uber:</strong> Agree on the price beforehand.</li>
          <li><strong>Private Driver:</strong> Comfortable but more expensive – great for groups or luggage.</li>
        </ul>
      </div>

      {/* Arrival in Guatapé */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-2">Arrival in Guatapé</h3>
        <p>Once there, most sights are walkable. For <strong>El Peñón de Guatapé</strong> or nearby spots, you can grab:</p>
        <ul className="list-disc list-inside mt-2">
          <li><strong>Tuk-Tuks</strong></li>
          <li><strong>Local taxis</strong></li>
        </ul>
      </div>
    </section>
  );
}
