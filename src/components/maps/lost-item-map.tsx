'use client'
import { Map } from '@vis.gl/react-maplibre'
import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"
import LostItemForm from "@/components/forms/lost-item-form"
import LostItemFormAI from "@/components/forms/lost-item-form-ai"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion } from "motion/react"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

const LostItemMap: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [isReporting, setIsReporting] = useState(false)
    const [isAIMode, setIsAIMode] = useState(false)

    // 地図クリック時の座標取得
    const handleMapClick = useCallback((e: { lngLat?: { lat: number; lng: number } }) => {
        if (!isReporting) return
        if (!e.lngLat) return
        setSelectedLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        setIsFormOpen(true)
        setIsReporting(false)
    }, [isReporting])

    // 報告ボタンクリック時
    function handleReportClick() {
        setIsReporting(true)
        setSelectedLocation(null)
    }

    // // AIモードで報告
    // function handleAIReport() {
    //     setIsAIMode(true)
    //     handleReportClick()
    // }

    // // 手動モードで報告
    // function handleManualReport() {
    //     setIsAIMode(false)
    //     handleReportClick()
    // }

    // キャンセルボタンクリック時
    function handleCancel() {
        setIsReporting(false)
        setSelectedLocation(null)
    }

    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Map
                    initialViewState={{
                        longitude: 139.95491810040247,
                        latitude: 35.83347653619293,
                        zoom: 15
                    }}
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                    style={{position: "absolute", top: 0, bottom: 0, width: "100%"}}
                    onClick={handleMapClick}
                />
            </div>
            {/* 上部中央の案内表示 */}
            {isReporting && (
                <motion.div 
                className="absolute top-6 right-5 left-5 sm:right-50 sm:left-50"
                initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-2 px-4 py-5 bg-white/90 rounded-xl shadow-lg border border-gray-200 backdrop-blur-md">
                        <MapPin className="text-blue-500 w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="font-semibold text-base sm:text-base text-gray-800">地図上の場所をタップしてください</span>
                    </div>
                </motion.div>
            )}
            <div className="absolute bottom-0 right-0 mb-11 mr-4 flex flex-col items-end space-y-5">
                {!isReporting && (
                    // ドロップダウンメニューを非表示にして、手動モードのみ表示
                    // <DropdownMenu>
                    //     <DropdownMenuTrigger asChild>
                    //         <Button
                    //             size="lg"
                    //             className="rounded-full shadow-lg"
                    //             onClick={handleReportClick}
                    //         >
                    //             落とし物を報告
                    //             <Plus className="h-6 w-6 ml-2" />
                    //         </Button>
                    //     </DropdownMenuTrigger>
                    //     <DropdownMenuContent align="end" className="w-48">
                    //         <DropdownMenuItem onClick={handleAIReport}>
                    //             <Bot className="mr-2 h-4 w-4" />
                    //             <span>AIで登録</span>
                    //         </DropdownMenuItem>
                    //         <DropdownMenuItem onClick={handleManualReport}>
                    //             <PenLine className="mr-2 h-4 w-4" />
                    //             <span>手動で登録</span>
                    //         </DropdownMenuItem>
                    //     </DropdownMenuContent>
                    // </DropdownMenu>
                    <Button
                    size="lg"
                    className="rounded-full shadow-lg"
                    onClick={handleReportClick}
                >
                    落とし物を報告
                    <Plus className="h-6 w-6 ml-2" />
                </Button>
                )}
                {isReporting && (
                    <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full shadow-lg"
                        onClick={handleCancel}
                    >
                        キャンセル
                    </Button>
                )}
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isAIMode ? 'AIで落とし物を報告' : '落とし物を報告'}
                        </DialogTitle>
                        <DialogDescription>
                            {isAIMode 
                                ? 'AIが落とし物の情報を分析して登録します。'
                                : '見つけた落とし物の情報を入力してください。'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    {isAIMode ? (
                        <LostItemFormAI
                            onSuccess={() => setIsFormOpen(false)}
                            selectedLocation={selectedLocation}
                        />
                    ) : (
                        <LostItemForm
                            onSuccess={() => setIsFormOpen(false)}
                            selectedLocation={selectedLocation}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LostItemMap