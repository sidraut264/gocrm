"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, PlusCircle, LayoutGrid, Table as TableIcon, GripVertical } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define the PipelineStage interface
interface PipelineStage {
    id: string;
    name: string;
    color: string;
    order: number;
}

// Sortable Deal Card Component - Compact version
function SortableDealCard({ deal, isOverlay = false }: { deal: any; isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: deal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group relative bg-white dark:bg-gray-800 rounded-lg p-2 shadow-xs border border-gray-200 dark:border-gray-700
                hover:shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing
                ${isDragging ? 'opacity-50 rotate-1 scale-102' : ''}
                ${isOverlay ? 'rotate-1 scale-102 shadow-md' : ''}
            `}
            {...attributes}
            {...listeners}
        >
            <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight pr-2 line-clamp-2">
                    {deal.title}
                </h3>
                <GripVertical className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
            
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ${deal.value?.toLocaleString() || '0'}
                    </span>
                    <span className={`
                        px-1.5 py-0.5 rounded-full text-xs font-medium
                        ${deal.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                          deal.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                    `}>
                        {deal.status?.charAt(0) || 'U'}
                    </span>
                </div>
                
                {deal.contact?.name && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {deal.contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {deal.contact.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Compact Droppable Stage Column Component
function StageColumn({ 
    stage, 
    deals, 
    totalValue 
}: { 
    stage: PipelineStage; 
    deals: any[]; 
    totalValue: number;
}) {
    // Generate dynamic gradient classes based on stage color
    const getStageColorClasses = (color: string) => {
        const colorMap: { [key: string]: string } = {
            'blue': 'border-t-blue-500 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-800',
            'yellow': 'border-t-yellow-500 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-800',
            'purple': 'border-t-purple-500 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-gray-800',
            'orange': 'border-t-orange-500 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950 dark:to-gray-800',
            'green': 'border-t-green-500 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-800',
            'red': 'border-t-red-500 bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-800',
            'indigo': 'border-t-indigo-500 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-gray-800',
            'pink': 'border-t-pink-500 bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-gray-800',
            'teal': 'border-t-teal-500 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-gray-800',
        };
        
        return colorMap[color] || 'border-t-gray-500 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800';
    };

    return (
        <div className={`
            rounded-lg border border-gray-200 dark:border-gray-700 border-t-4
            min-w-[250px] max-w-[250px] flex-shrink-0 h-fit
            ${getStageColorClasses(stage.color)}
        `}>
            {/* Stage Header */}
            <div className="p-2 pb-1">
                <div className="flex items-center justify-between mb-0.5">
                    <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate max-w-[160px]">
                        {stage.name}
                    </h2>
                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-xs font-medium">
                        {deals.length}
                    </span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    ${totalValue.toLocaleString()}
                </p>
            </div>

            {/* Deals Container */}
            <div className="px-2 pb-2">
                <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 min-h-[100px]">
                        {deals.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-xs">
                                <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <LayoutGrid className="h-5 w-5" />
                                </div>
                                <p>Drop deals here</p>
                            </div>
                        ) : (
                            deals.map((deal) => (
                                <SortableDealCard key={deal.id} deal={deal} />
                            ))
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

export default function DealsPage() {
    const { data: deals, mutate: mutateDeals } = useSWR("/api/deals", fetcher);
    const { data: pipelineStages, error: stagesError } = useSWR("/api/pipeline-stages", fetcher);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState<"table" | "kanban">("kanban"); // Default to kanban now
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const filteredDeals = useMemo(() => {
        const list = Array.isArray(deals) ? deals : [];
        if (!searchTerm) return list;

        return list.filter((deal: any) =>
            deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [deals, searchTerm]);

    // Group deals by stage for Kanban using dynamic pipeline stages
    const groupedDeals = useMemo(() => {
        if (!pipelineStages || !Array.isArray(pipelineStages)) {
            return [];
        }

        return pipelineStages.map((stage: PipelineStage) => {
            const stageDeals = filteredDeals.filter((deal: any) => {
                // Handle both stage.name and stage.id matching
                return (deal.stage?.name === stage.name) || 
                       (deal.stage?.id === stage.id) ||
                       (deal.stageId === stage.id);
            });
            const totalValue = stageDeals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
            
            return {
                stage,
                deals: stageDeals,
                totalValue,
            };
        });
    }, [filteredDeals, pipelineStages]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the active deal
        const activeDeal = filteredDeals.find((deal: any) => deal.id === activeId);
        if (!activeDeal) return;

        // Determine the new stage based on where it's dropped
        let newStage: PipelineStage | null = null;

        // If dropped on another deal, get that deal's stage
        const overDeal = filteredDeals.find((deal: any) => deal.id === overId);
        if (overDeal && pipelineStages) {
            newStage = pipelineStages.find((stage: PipelineStage) => 
                stage.name === overDeal.stage?.name || 
                stage.id === overDeal.stage?.id ||
                stage.id === overDeal.stageId
            ) || null;
        } else if (pipelineStages) {
            // If dropped on a stage column, find the corresponding stage
            const stageGroup = groupedDeals.find(group => 
                group.deals.some(deal => deal.id === overId)
            );
            if (stageGroup) {
                newStage = stageGroup.stage;
            }
        }

        // Get current stage info
        const currentStageId = activeDeal.stage?.id || activeDeal.stageId;
        const newStageId = newStage?.id;

        // Only update if the stage actually changed
        if (newStage && newStageId !== currentStageId) {
            try {
                // Optimistically update the UI
                const updatedDeals = deals.map((deal: any) => 
                    deal.id === activeId 
                        ? { 
                            ...deal, 
                            stage: { id: newStage.id, name: newStage.name },
                            stageId: newStage.id
                          }
                        : deal
                );
                mutateDeals(updatedDeals, false);

                // Make API call to update the deal
                await fetch(`/api/deals/${activeId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stageId: newStage.id }),
                });

                // Revalidate the data
                mutateDeals();
            } catch (error) {
                console.error('Failed to update deal stage:', error);
                // Revert on error
                mutateDeals();
            }
        }
    };

    // Loading states
    if (!deals || !pipelineStages) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading deals and pipeline stages...</p>
                </div>
            </div>
        );
    }

    // Error state for pipeline stages
    if (stagesError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-red-600 dark:text-red-400">Failed to load pipeline stages</p>
                    <p className="text-gray-500 text-sm mt-2">Please check your API configuration</p>
                </div>
            </div>
        );
    }

    const activeDeal = activeId ? filteredDeals.find((deal: any) => deal.id === activeId) : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-3 py-4 max-w-7xl">
                {/* Header - Compact */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            Sales Pipeline
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                            {deals.length} opportunities
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant={view === "table" ? "default" : "outline"} 
                            onClick={() => setView("table")}
                            className="shadow-sm h-8 px-2 text-xs"
                        >
                            <TableIcon className="h-3 w-3 mr-1" /> Table
                        </Button>
                        <Button 
                            variant={view === "kanban" ? "default" : "outline"} 
                            onClick={() => setView("kanban")}
                            className="shadow-sm h-8 px-2 text-xs"
                        >
                            <LayoutGrid className="h-3 w-3 mr-1" /> Kanban
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm h-8 px-2 text-xs">
                            <PlusCircle className="h-3 w-3 mr-1" />
                            New Deal
                        </Button>
                    </div>
                </div>

                {/* Search - Compact */}
                <div className="relative mb-4 max-w-md">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                        placeholder="Search deals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-7 h-8 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                </div>

                {/* Table View */}
                {view === "table" && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        {filteredDeals.length === 0 ? (
                            <div className="text-center py-10">
                                <LayoutGrid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {searchTerm ? "No deals match your search" : "No deals yet"}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                                        <TableHead className="font-semibold text-xs p-2">Deal Title</TableHead>
                                        <TableHead className="font-semibold text-xs p-2">Value</TableHead>
                                        <TableHead className="font-semibold text-xs p-2">Stage</TableHead>
                                        <TableHead className="font-semibold text-xs p-2">Contact</TableHead>
                                        <TableHead className="font-semibold text-xs p-2">Status</TableHead>
                                        <TableHead className="text-right font-semibold text-xs p-2">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeals.map((deal: any) => {
                                        // Find the stage info for this deal
                                        const stageInfo = pipelineStages?.find((stage: PipelineStage) => 
                                            stage.id === deal.stageId || 
                                            stage.id === deal.stage?.id || 
                                            stage.name === deal.stage?.name
                                        );
                                        
                                        return (
                                            <TableRow key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <TableCell className="font-medium text-xs p-2">{deal.title}</TableCell>
                                                <TableCell className="font-semibold text-green-600 dark:text-green-400 text-xs p-2">
                                                    ${deal.value?.toLocaleString() || '0'}
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <span className={`
                                                        px-1.5 py-0.5 rounded-full text-xs font-medium
                                                        ${stageInfo?.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                          stageInfo?.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                          stageInfo?.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                          stageInfo?.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                                          stageInfo?.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                                                          'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'}
                                                    `}>
                                                        {stageInfo?.name || deal.stage?.name || "Unknown"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs p-2">{deal.contact?.name || "-"}</TableCell>
                                                <TableCell className="p-2">
                                                    <span className={`
                                                        px-1.5 py-0.5 rounded-full text-xs font-medium
                                                        ${deal.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                                                          deal.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                                                    `}>
                                                        {deal.status?.charAt(0) || 'U'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right p-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="text-xs">
                                                            <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                                Delete Deal
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                )}

                {/* Kanban View */}
                {view === "kanban" && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                            {groupedDeals.map(({ stage, deals, totalValue }) => (
                                <StageColumn
                                    key={stage.id}
                                    stage={stage}
                                    deals={deals}
                                    totalValue={totalValue}
                                />
                            ))}
                        </div>

                        <DragOverlay>
                            {activeDeal ? <SortableDealCard deal={activeDeal} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    );
}