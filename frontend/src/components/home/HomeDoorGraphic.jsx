function HomeDoorGraphic() {
  return (
    <div className="tr-home-door-scene" aria-hidden="true">
      <span className="tr-home-door-star tr-home-door-star--one" />
      <span className="tr-home-door-star tr-home-door-star--two" />
      <span className="tr-home-door-star tr-home-door-star--three" />
      <span className="tr-home-door-ring tr-home-door-ring--outer" />
      <span className="tr-home-door-ring tr-home-door-ring--inner" />
      <div className="tr-home-door-frame">
        <div className="tr-home-door-panel">
          <span className="tr-home-door-line tr-home-door-line--top" />
          <span className="tr-home-door-line tr-home-door-line--bottom" />
          <span className="tr-home-door-knob" />
          <span className="tr-home-door-keyhole" />
        </div>
      </div>
      <span className="tr-home-door-floor" />
    </div>
  );
}

export default HomeDoorGraphic;
