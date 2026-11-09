import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function ThemeMap({ latitude, longitude }) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  // 좌표가 없거나 올바르지 않은 경우
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return <p>위치 정보가 없습니다.</p>;
  }

  const position = { lat, lng };

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        language="ko"
        region="KR"
      >
        <Map
          defaultCenter={position}
          defaultZoom={14}
          mapId="DEMO_MAP_ID" //테스트용
          disableDefaultUI={true}
          // streetViewControl={false}
        >
          <AdvancedMarker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
}

export default ThemeMap;
