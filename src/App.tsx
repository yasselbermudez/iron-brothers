import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Dashboard from './components/pages/dashboard';
import PokerRanking from './components/pages/poker-ranking';
import GymProfileCards from './components/pages/gym-data';

function App() {

  const navItems = [
    { id: 'principal', icon: 'dashboard', label: 'Principal' },
    { id: 'gym', icon: 'fitness_center', label: 'Gym' },
    { id: 'poker', icon: 'playing_cards', label: 'Poker' },
    { id: 'vida', icon: 'groups', label: 'Vida' },
    { id: 'sttings', icon: 'person', label: 'Settings' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-950">
  <Tabs defaultValue={navItems[0].label} className="w-full">
    <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-blue-700/30">
      {navItems.map((item) => (
        <TabsTrigger 
          key={item.label}
          value={item.label}
          className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 text-white/60 hover:text-white/80 transition-colors"
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
    
    {navItems.map((item) => (
      <TabsContent key={item.label} value={item.label} className="mt-6">
        {item.label === 'Principal' && <Dashboard />}
        {item.label === 'Poker' && <PokerRanking />}
        {item.label === 'Gym' && <GymProfileCards />}
      </TabsContent>
    ))}
  </Tabs>
</main>
  );
}
  

export default App
