
const Dashboard = () => {
  
  const gymStats = [
    { label: '% Asistencia', value: '95%' },
    { label: 'Press Banca Max', value: '120kg' },
    { label: 'Récord Paralelas', value: '35' },
    { label: 'Integrantes', value: '5' },
    { label: 'IPF GL Más Alto', value: '30' }
  ];

  const pokerStats = [
    {
      title: 'Estadísticas',
      items: [
        { label: 'Ganancias Totales', value: '$80000', highlight: true },
        { label: 'Partidas Jugadas', value: '10', highlight: false }
      ]
    },
    {
      title: 'Puntuaciones y Récords',
      items: [
        { label: 'Mayor Bote', value: '$40000', highlight: true },
        { label: 'Mejor Mano', value: 'Color', highlight: false }
      ]
    }
  ];

  const titles = [
    { icon: 'campaign', title: 'El que más habla en el gym', awardedTo: 'Luis' },
    { icon: 'sentiment_satisfied', title: 'Record de perder aura seguida "Le doy dos"', awardedTo: 'Tejon' },
    { icon: 'friend', title: 'Ojo al fallo', awardedTo: 'Pollo' },
    { icon: 'start', title: 'The king of AllIn', awardedTo: 'Luis' },
    { icon: 'paid', title: 'Ya me puedo ir', awardedTo: 'Marquitos' },
    { icon: 'attach_money', title: 'El millonario', awardedTo: 'Javi' },
    { icon: 'style', title: 'El que tiene mejores manos', awardedTo: 'Tejon' }
  ];

  const news = [
    { title: 'Boda de Javi y la Inglesa', description: 'El próximo mes. ¡Preparen los trajes!' },
    { title: '¡Nueva interaccion!', description: 'Pollo y Pollita han intercambiado miradas' },
    { title: '¡La hermana del tejon cumple a;os!', description: 'El tejon elabora un plan malebolo para ir a una piscina' },
    { title: '¡Marquitos empiesa en el Gym!', description: 'Hasta aki llegaron las menores' },
    { title: 'Luiz perdio el reto de saludar a la Tosca', description: 'Tiene que quitarse el pulover en el medio del gym "Hora de lucir esa estetica mediocre"' },
    { title: 'Mesa de poker en casa del Pollo', description: 'Gran torneo , el Javi dice que esta vez si no va a perder una con estos locos' },
    { title: 'Varadero Beach', description: 'Luis se inventa un plan loco para ir a varadero al berro' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-950">

      {/* Main Content */}
      <main className="flex-grow p-4">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Iron Brothers
          </h1>
          <p className="mt-2 text-base text-white/70">
            Un blog mejorado para seguir y documentar nuestros progresos en el gym ,en el poker y en el dia a dia
          </p>
        </div>

        {/* Gym Stats Section */}
        <section className="mb-8">
          <h2 className="px-4 pb-3 pt-5 text-2xl font-bold tracking-tight text-white">
            Datos del Gym
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {gymStats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col gap-2 rounded-lg bg-blue-700/20 p-4 text-center ${
                  index === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <p className="text-sm font-medium text-white/70">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Poker Section */}
        <section className="mb-8">
          <h2 className="px-4 pb-3 pt-5 text-2xl font-bold tracking-tight text-white">
            Cosas del Poker
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pokerStats.map((section, index) => (
              <div
                key={index}
                className="rounded-lg bg-blue-700/20 p-6"
              >
                <h3 className="mb-3 text-lg font-bold text-white">
                  {section.title}
                </h3>
                {section.items.map((item, i) => (
                  <p key={i} className="text-base font-medium text-white/70">
                    {item.label}:{' '}
                    <span
                      className={
                        item.highlight
                          ? 'font-bold text-blue-700'
                          : 'font-bold text-white'
                      }
                    >
                      {item.value}
                    </span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Titles Section */}
        <section className="mb-8">
          <h2 className="px-4 pb-3 pt-5 text-2xl font-bold tracking-tight text-white">
            Títulos
          </h2>
          <div className="space-y-3">
            {titles.map((title, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg bg-blue-700/20 p-4"
              >
                <span className="material-symbols-outlined text-3xl text-blue-700">
                  {title.icon}
                </span>
                <div>
                  <p className="font-bold text-white">{title.title}</p>
                  <p className="text-sm text-white/70">
                    Otorgado a: {title.awardedTo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* News and Events Section */}
        <section>
          <h2 className="px-4 pb-3 pt-5 text-2xl font-bold tracking-tight text-white">
            Noticias
          </h2>

          {/* Noticia 1 */}
          <div
            className="my-4 relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%), url("https://images.unsplash.com/photo-1541278107931-e006523892df?w=800")`
            }}
          >
            <div className="flex w-full flex-col gap-1 p-4 text-white">
              <p className="text-lg font-bold tracking-tight">
                Próxima salida: ¡Noche de Poker!
              </p>
              <p className="text-sm font-medium">
                Este viernes en casa del Pollo. ¡No faltes!
              </p>
            </div>
          </div>

          {/* Noticia 2 */}
          <div
            className="my-4 relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%), url("./assets/ronnie.jpg")`
            }}
          >
            <div className="flex w-full flex-col gap-1 p-4 text-white">
              <p className="text-lg font-bold tracking-tight">
                The King
              </p>
              <p className="text-sm font-medium">
                Yeah buddy!! Light weight baby!! 
              </p>
            </div>
          </div>

          {/* Noticia 3 */}
          <div
            className="my-4 relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%), url("./assets/ipvce.jpeg")`
            }}
          >
            <div className="flex w-full flex-col gap-1 p-4 text-white">
              <p className="text-lg font-bold tracking-tight">
                IPVCE
              </p>
              <p className="text-sm font-medium">
                Somos de la estirpe IPVCEANA 
              </p>
            </div>
          </div>

          {/* Noticia 4 */}
          <div
            className="my-4 relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%), url("./assets/ramon.jpg")`
            }}
          >
            <div className="flex w-full flex-col gap-1 p-4 text-white">
              <p className="text-lg font-bold tracking-tight">
                Ramon Dino
              </p>
              <p className="text-sm font-medium">
                Tenemos Campeon Mr Olympia 2025 
              </p>
            </div>
          </div>
          
          <h2 className="px-4 pb-3 pt-5 text-2xl font-bold tracking-tight text-white">
            Eventos
          </h2>

          <div className="mt-4 space-y-3">
            {news.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-blue-700/20 p-4"
              >
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-sm text-white/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Google Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
      />
    </div>
  );
};

export default Dashboard;