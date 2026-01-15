import { ChevronDown, ChevronUp, Loader2, Users, Lock } from "lucide-react";
import type { Group } from "../../services/api.interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface GroupCardProps{
    group:Group
    expandedGroupId:string|null
    joiningGroup:boolean
    setExpandedGroupId: (groupId:string|null) => void
    handleJoinGroup: (groupId: string,password:string) => void
}

export default function GroupCard ({group,expandedGroupId,joiningGroup,handleJoinGroup,setExpandedGroupId}:GroupCardProps){

    const [password, setPassword] = useState('');
    
    const toggleGroup = () => {
        setExpandedGroupId(expandedGroupId === group.id ? null : group.id);
    };

    const isExpanded = expandedGroupId === group.id

    const handleJoin = () => {
      handleJoinGroup(group.id,password)
    }

    return (
      <Card
        key={group.id} 
        className='bg-slate-900 border-slate-800 p-0 rounded-none'
      > 
      <CardHeader
        onClick={toggleGroup}
        className="px-6 py-4 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800"
      >
        <CardTitle className="text-2xl text-white">
          {group.group_name}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-slate-400 mb-2">
            Creado por <span className="text-blue-400">{group.created_by}</span>
          </p>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Users size={16} />
              <span>{group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'}</span>
            </div>
            <div className="text-slate-400 ml-2">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="space-y-3 pb-6">    
          <p className="text-sm text-slate-400">
            Ingresa la contraseña para unirte a este grupo
          </p>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="password"
              placeholder="Contraseña del grupo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-500"
              autoFocus
            />
          </div>
          <Button
            onClick={handleJoin}
            disabled={!password.trim()}
            className="w-full rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600"
          >
            {joiningGroup
              ?<><Loader2 className='animate-spin'/>Uniendose</>
              :<><Lock className="h-4 w-4 mr-2" />Unirse al Grupo</>
            }
          </Button>
        </CardContent>
      )}
    </Card>
  );
}