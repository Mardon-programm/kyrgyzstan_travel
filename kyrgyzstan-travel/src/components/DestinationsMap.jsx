import { MapPin, Filter, Droplets, Mountain, Home, Landmark } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegions, useDestinations } from '../hooks/useApi';

const categoryIcons = {
  lakes: Droplets,
  gorges: Mountain,
  history: Landmark,
  yurts: Home,
};

const categoryTranslations = {
  lakes: 'destinationsMap.categories.lakes',
  gorges: 'destinationsMap.categories.gorges',
  history: 'destinationsMap.categories.history',
  yurts: 'destinationsMap.categories.yurts',
};

export default function DestinationsMap() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const { data: regionsData, loading: regionsLoading } = useRegions();
  const { data: destinationsData, loading: destinationsLoading } = useDestinations();

  const regions = useMemo(() => {
    if (!regionsData?.results) return [];
    return regionsData.results.map((region) => {
      const destCount = destinationsData?.results?.filter(d => d.region?.id === region.id).length || region.spots_count;
      return {
        ...region,
        spots: destCount,
        coords: [Number(region.longitude), Number(region.latitude)],
      };
    }).filter(r => r.latitude && r.longitude);
  }, [regionsData, destinationsData]);

  const loading = regionsLoading || destinationsLoading;

  const filteredRegions = activeCategory === 'all'
    ? regions
    : regions.filter((r) => r.type === activeCategory);

  const categories = useMemo(() => [
    { id: 'all', label: t('destinationsMap.categories.all'), icon: null, count: regions.length },
    { id: 'lakes', label: t('destinationsMap.categories.lakes'), icon: Droplets, count: regions.filter(r => r.type === 'lakes').length },
    { id: 'gorges', label: t('destinationsMap.categories.gorges'), icon: Mountain, count: regions.filter(r => r.type === 'gorges').length },
    { id: 'history', label: t('destinationsMap.categories.history'), icon: Landmark, count: regions.filter(r => r.type === 'history').length },
    { id: 'yurts', label: t('destinationsMap.categories.yurts'), icon: Home, count: regions.filter(r => r.type === 'yurts').length },
  ], [t, regions]);

  const MIN_LNG = 69.0;
  const MAX_LNG = 80.5;
  const MIN_LAT = 39.0;
  const MAX_LAT = 43.5;
  const PADDING = 40;
  const VIEWBOX_WIDTH = 800;
  const VIEWBOX_HEIGHT = 600;

  const project = (lng, lat) => {
    const scaleX = (VIEWBOX_WIDTH - 2 * PADDING) / (MAX_LNG - MIN_LNG);
    const scaleY = (VIEWBOX_HEIGHT - 2 * PADDING) / (MAX_LAT - MIN_LAT);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (VIEWBOX_WIDTH - (MAX_LNG - MIN_LNG) * scale) / 2;
    const offsetY = (VIEWBOX_HEIGHT - (MAX_LAT - MIN_LAT) * scale) / 2;

    const x = offsetX + (lng - MIN_LNG) * scale;
    const y = VIEWBOX_HEIGHT - (offsetY + (lat - MIN_LAT) * scale);

    return [x, y];
  };

  const kyrgyzstanPath = useMemo(() => {
    const kyrgyzstanCoords = [
      [70.962315, 42.266154], [71.186281, 42.704293], [71.844638, 42.845395],
      [73.489758, 42.500894], [73.645304, 43.091272], [74.212866, 43.298339],
      [75.636965, 42.8779], [76.000354, 42.988022], [77.658392, 42.960686],
      [79.142177, 42.856092], [79.643645, 42.496683], [80.25999, 42.349999],
      [80.11943, 42.123941], [78.543661, 41.582243], [78.187197, 41.185316],
      [76.904484, 41.066486], [76.526368, 40.427946], [75.467828, 40.562072],
      [74.776862, 40.366425], [73.822244, 39.893973], [73.960013, 39.660008],
      [73.675379, 39.431237], [71.784694, 39.279463], [70.549162, 39.604198],
      [69.464887, 39.526683], [69.55961, 40.103211], [70.648019, 39.935754],
      [71.014198, 40.244366], [71.774875, 40.145844], [73.055417, 40.866033],
      [71.870115, 41.3929], [71.157859, 41.143587], [70.420022, 41.519998],
      [71.259248, 42.167711], [70.962315, 42.266154]
    ];
    const points = kyrgyzstanCoords.map(([lng, lat]) => project(lng, lat));
    return 'M' + points[0][0].toFixed(1) + ',' + points[0][1].toFixed(1) + ' ' +
      points.slice(1).map(([x, y]) => 'L' + x.toFixed(1) + ',' + y.toFixed(1)).join(' ') + ' Z';
  }, []);

  const regionPositions = useMemo(() => {
    const mapped = {};
    regions.forEach((r) => {
      if (r.coords) {
        mapped[r.id] = project(r.coords[0], r.coords[1]);
      }
    });
    return mapped;
  }, [regions]);

  if (loading) {
    return (
      <section id="destinations-map" className="py-20 lg:py-32 bg-graphite-card" aria-labelledby="map-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="map-title" className="section-title">{t('destinationsMap.title')}</h2>
            <p className="section-subtitle">{t('destinationsMap.subtitle')}</p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-graphite border border-white/10 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section id="destinations-map" className="py-20 lg:py-32 bg-graphite-card" aria-labelledby="map-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h2 id="map-title" className="section-title">{t('destinationsMap.title')}</h2>
            <p className="section-subtitle">{t('destinationsMap.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter regions by category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-terracotta text-white shadow-glow-terracotta'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`${cat.id}-panel`}
              >
                {cat.icon && <cat.icon className="w-4 h-4" aria-hidden="true" />}
                <span>{cat.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative" role="region" aria-label="Kyrgyzstan regions map">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-graphite border border-white/10 relative">
            <svg
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Map of Kyrgyzstan with regions highlighted"
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="topoPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <path d="M10 0 C5 0 0 5 0 10 C0 15 5 20 10 20 C15 20 20 15 20 10 C20 5 15 0 10 0"
                        fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
                </pattern>
                <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feOffset dx="0" dy="2" />
                  <feGaussianBlur stdDeviation="2" result="offset-blur" />
                  <feComposite in="SourceGraphic" in2="offset-blur" operator="out" />
                </filter>
              </defs>

              <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#topoPattern)" />

              <path
                d={kyrgyzstanPath}
                fill="rgba(30, 63, 54, 0.35)"
                stroke="rgba(30, 63, 54, 0.7)"
                strokeWidth="1.5"
                filter="url(#innerShadow)"
                className="transition-all duration-300"
              />

              {filteredRegions.map((region) => {
                const position = regionPositions[region.id];
                if (!position) return null;

                const [x, y] = position;
                const isActive = hoveredRegion === region.id;
                const isFiltered = activeCategory !== 'all' && region.type !== activeCategory;

                return (
                  <g
                    key={region.id}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    className="cursor-pointer"
                    style={{ filter: isFiltered ? 'grayscale(1) opacity-30' : 'none' }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 18 : 14}
                      fill={isActive ? 'rgba(217, 78, 52, 0.3)' : 'rgba(217, 78, 52, 0.15)'}
                      stroke="#D94E34"
                      strokeWidth={isActive ? 3 : 2}
                      filter="url(#glow)"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={6}
                      fill="#D94E34"
                      className="transition-all duration-300"
                    />
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r={22}
                        fill="none"
                        stroke="#D94E34"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {hoveredRegion && (
                <>
                  {filteredRegions.map((region) => {
                    if (region.id !== hoveredRegion) return null;
                    const position = regionPositions[region.id];
                    if (!position) return null;

                    const [x, y] = position;

                    return (
                      <foreignObject
                        key={`tooltip-${region.id}`}
                        x={Math.min(x + 30, VIEWBOX_WIDTH - 220)}
                        y={Math.max(y - 60, 20)}
                        width="220"
                        height="100"
                      >
                        <div className="glass-card p-4 animate-scale-in" style={{ width: '200px' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                            <span className="font-display font-bold text-white">{region.name}</span>
                          </div>
                          <p className="text-white/60 text-sm mb-2">{region.name_kg || region.name}</p>
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <span className="px-2 py-1 rounded bg-terracotta/20 text-terracotta">
                              {region.spots} {t('destinationsMap.spots')}
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    );
                  })}
                </>
              )}
            </svg>

            <div className="absolute bottom-4 right-4 glass px-4 py-3 text-xs text-white/60 font-mono">
              Map data © OpenStreetMap contributors
            </div>
          </div>

          <div
            id={`${activeCategory}-panel`}
            role="tabpanel"
            aria-label={`${categories.find(c => c.id === activeCategory)?.label} regions`}
            className="mt-8 animate-fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRegions.map((region) => (
                <article
                  key={region.id}
                  className="glass-card p-6 text-center hover:border-terracotta/50 transition-all"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/20 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-terracotta" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">{region.name}</h3>
                  <p className="text-white/50 text-sm mb-3">{region.name_kg || region.name}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {region.spots} {t('destinationsMap.spots')}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}