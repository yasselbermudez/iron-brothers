import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronUp,
  User,
  Weight,
  Ruler,
  Target,
  Heart,
  Quote,
  Flame,
  Crown,
  Award,
  Trophy,
  Gavel,
  BicepsFlexed,
  Dumbbell,
  Angry,
  Calendar,
  Star,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import {type GymProfile} from "../../services/api.interfaces"

// Helper Component for Info Items
interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color: Color
}

type Color = "blue"|"red"|"yellow"|"green"|"purple"|"orange"|"pink"

interface ProfileCardProps {
  profileData: GymProfile;
  selectedProfile: string|null;
  setSelectedProfile: (selectedGroup:string|null)=>void
}

function ProfileCard({ profileData,setSelectedProfile,selectedProfile}: ProfileCardProps) {
  
  const handleToggle = () => {
      setSelectedProfile(selectedProfile === profileData.user_id ? null : profileData.user_id);
  };
  
  const isExpanded = selectedProfile===profileData.user_id

  const exerciseLabels: Record<string, string> = {
    pressBanca: "Press Banca",
    sentadilla: "Sentadilla",
    pesoMuerto: "Peso Muerto",
    biceps: "Bíceps",
  };

  return (
    <Card
      key={profileData.id}
      className={`
        p-0
        py-1
        md:py-2
        lg:py-3
        bg-slate-900
        border-slate-700
        transition-all duration-500
        hover:bg-slate-800/50
        ${isExpanded ? "md:col-span-2 lg:col-span-3" : ""}
      `}
      onClick={handleToggle}
    >
      <Collapsible open={isExpanded} onOpenChange={handleToggle}>
        
        <CardHeader className="p-2 sm:p-4 gap-4">
            
            <CardTitle className="flex text-2xl font-bold text-white items-center">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-slate-700">
                <AvatarImage 
                  src={profileData.img} 
                  alt={profileData.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-lg font-bold">
                  <User/>
                </AvatarFallback>
              </Avatar>
              <div className="m-2">
                {profileData.name}
                <div className="text-lg max-w-[60vw] sm:max-w-[40vw] md:max-w-[20vw] lg:max-w-[20vw] text-purple-300 break-words italic mt-1">
                  "{profileData.apodo || 'Sin apodo'}"
                </div>
              </div>
              
            </CardTitle>
            <CardDescription className="flex justify-between items-end">
              <div className="flex flex-wrap gap-2 ">
                {profileData.titulo && (
                  <Badge 
                    className="bg-purple-600/80 text-white border-purple-800"
                    variant="secondary"
                  >
                    {profileData.titulo}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className="bg-slate-800/50 text-slate-300 border-slate-600"
                >
                  <Weight className="mr-1 h-3 w-3" />
                  {profileData.peso_corporal}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-slate-800/50 text-slate-300 border-slate-600"
                >
                  <Ruler className="mr-1 h-3 w-3" />
                  {profileData.estatura}
                </Badge>
                {profileData.mujeres && (              
                  <Badge 
                    variant="outline" 
                    className="max-w-[30vw] md:max-w-[20vw] bg-pink-600/20 text-pink-300 break-words border-pink-700/30"
                  >
                    <Heart className="mr-1 h-3 w-3" />
                    {profileData.mujeres}
                  </Badge>
                )}
              </div>
                    <CollapsibleTrigger asChild>
                      <div className="text-white cursor-pointer">
                        {isExpanded ? (
                          <ChevronUp/>
                        ) : (
                          <ChevronDown/>
                        )}

                      </div>
                    </CollapsibleTrigger>
                  </CardDescription>
        </CardHeader>

        {/* Expandable Content */}
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">

          <CardContent className="grid md:grid-cols-2 p-2 sm:p-4 gap-0 md:gap-6 lg:gap-8 ">
              {/* Left Column */}
              <div className="space-y-6 border-t pt-3 sm:p-5 sm:border border-slate-700/50 ">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-slate-400" />
                    Caracteristicas
                  </h3>
                  
                  <div className="grid gap-4">
                    <InfoItem 
                      label="Edad" 
                      value={profileData.edad}
                      icon={<Calendar className="h-4 w-4 text-green-400" />}
                      color="green"
                    />
                    <InfoItem 
                      label="Apodo" 
                      value={profileData.apodo || 'Sin apodo'}
                      icon={<Flame className="h-4 w-4 text-red-400" />}
                      color="red"
                    />
                    <InfoItem 
                      label="Título" 
                      value={profileData.titulo || 'Sin título'}
                      icon={<Award className="h-4 w-4 text-yellow-400" />}
                      color="yellow" 
                    />
                    <InfoItem 
                      label="Peso Corporal" 
                      value={profileData.peso_corporal+" kg"}
                      icon={<Weight className="h-4 w-4 text-blue-400" />}
                      color="blue"
                    />
                    <InfoItem 
                      label="Mujeres" 
                      value={profileData.mujeres || 'Ninguna'}
                      icon={<Heart className="h-4 w-4 text-pink-400" />}
                      color="pink"
                    />
                    <InfoItem 
                      label="Estatura" 
                      value={profileData.estatura+" cm"}
                      icon={<Target className="h-4 w-4 text-orange-400" />}
                      color="orange"
                    />
                    <InfoItem 
                      label="Objetivo" 
                      value={profileData.objetivo || 'Sin objetivo'}
                      icon={<Target className="h-4 w-4 text-green-400" />}
                      color="green"
                    />

                    <InfoItem 
                      label="Aura" 
                      value={profileData.aura}
                      icon={<Star className="h-4 w-4 text-red-400" />}
                      color="red"
                    />

                    <InfoItem 
                      label="Frase" 
                      value={profileData.frase || 'Sin frase'}
                      icon={<Quote className="h-4 w-4 text-purple-400" />}
                      color="purple"
                    />

                  </div>
                </div>
              </div>

              {/* Right Column - Personal Records */}
              <div className="space-y-4">
                <div className="border-t pt-3 sm:p-5 sm:border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Record Personal
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(profileData.pesos).map(([exercise, weight]) => (
                      <div 
                        key={exercise} 
                        className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            
                              {getExerciseIcon(exercise)}
                            
                            <div>
                              <h4 className="text-white font-medium capitalize">
                                {exerciseLabels[exercise] || exercise}
                              </h4>
                              <p className="text-xs text-slate-400">Máximo peso levantado</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-400">{weight}</p>
                            <p className="text-xs text-slate-400">kg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            
          </CardContent>
          <CardFooter className="p-4 justify-end">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded text-slate-400 border-0 hover:bg-slate-800 hover:text-white"
                onClick={handleToggle}
              >
                <ChevronUp/>
                Cerrar detalles
              </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function InfoItem({ label, value, icon, color }: InfoItemProps) {
  const colorMap = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400'
  };

  return (
    <div className="flex items-start justify-between p-3 bg-slate-900/30 rounded hover:bg-slate-800/30 transition-colors gap-3 ">
      <div className="flex items-center gap-3 flex-shrink-0">
        {icon}
        <span className="text-white">{label}</span>
      </div>
      <p className={`${colorMap[color]} text-right font-medium break-words max-w-[30vw]`}>
        {value}
      </p>
    </div>
  );
}

function getExerciseIcon( exercise: string ) {
    switch (exercise) {
        case 'pressBanca':
            return <Gavel className="h-6 w-6 text-blue-400" />;
        case 'sentadilla':
            return <Dumbbell className="h-6 w-6 text-green-400" />;
        case 'pesoMuerto':
            return <Crown className="h-6 w-6 text-red-400" />;   
        case 'biceps': 
            return <BicepsFlexed className="h-6 w-6 text-orange-400" />;
        case 'prensa':
            return <Angry className="h-6 w-6 text-yellow-400" />;
        default:
            return <Dumbbell className="h-6 w-6 text-gray-400" />;
    }
}

export { ProfileCard };

