import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from '../../AuthContext/auth-hooks';
import MisionesGame from "../AllMissions";
import AllLogros from "../Logros";

function Galery() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) return 

  return (
        <Tabs defaultValue="myGymProfile" className="w-full">
          <TabsList className="text-slate-500 rounded-xl grid w-full grid-cols-2 bg-slate-900 ">
            <TabsTrigger value="myGymProfile" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              Todas las Misiones
            </TabsTrigger>
            <TabsTrigger value="gymProfiles" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              Todos los Logros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myGymProfile" className="mt-1 md:mt-2 lg:mt-3">
              <MisionesGame/>
          </TabsContent>

          <TabsContent value="gymProfiles" className="mt-1 md:mt-2 lg:mt-3">
              <AllLogros/>
          </TabsContent>
        </Tabs>
  );
}

export default Galery;