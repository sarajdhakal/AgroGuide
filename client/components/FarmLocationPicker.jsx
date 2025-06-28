"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, CheckCircle, AlertCircle, Map, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FarmLocationPicker({ value, onChange, className }) {
    const [isValid, setIsValid] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [selectedCoordinates, setSelectedCoordinates] = useState(null)
    const [isValidating, setIsValidating] = useState(false)
    const [clickedPosition, setClickedPosition] = useState(null)
    const [isSelectMode, setIsSelectMode] = useState(false)
    const inputRef = useRef(null)
    const mapContainerRef = useRef(null)

    // Nepal bounds for coordinate calculation
    const NEPAL_BOUNDS = {
        north: 30.4,
        south: 26.3,
        east: 88.2,
        west: 80.0,
    }

    // Mock location data for Nepal (for suggestions and quick selection)
    const nepalLocations = [
        {
            id: "1",
            name: "Kathmandu",
            district: "Kathmandu",
            province: "Bagmati",
            coordinates: { lat: 27.7172, lng: 85.324 },
        },
        {
            id: "2",
            name: "Bharatpur",
            district: "Chitwan",
            province: "Bagmati",
            coordinates: { lat: 27.6244, lng: 84.3297 },
        },
        {
            id: "3",
            name: "Pokhara",
            district: "Kaski",
            province: "Gandaki",
            coordinates: { lat: 28.2096, lng: 83.9856 },
        },
        {
            id: "4",
            name: "Lalitpur",
            district: "Lalitpur",
            province: "Bagmati",
            coordinates: { lat: 27.6588, lng: 85.3247 },
        },
        {
            id: "5",
            name: "Bhaktapur",
            district: "Bhaktapur",
            province: "Bagmati",
            coordinates: { lat: 27.671, lng: 85.4298 },
        },
        {
            id: "6",
            name: "Biratnagar",
            district: "Morang",
            province: "Province 1",
            coordinates: { lat: 26.4525, lng: 87.2718 },
        },
        {
            id: "7",
            name: "Birgunj",
            district: "Parsa",
            province: "Madhesh",
            coordinates: { lat: 27.0104, lng: 84.8805 },
        },
        {
            id: "8",
            name: "Dharan",
            district: "Sunsari",
            province: "Province 1",
            coordinates: { lat: 26.8147, lng: 87.2789 },
        },
        {
            id: "9",
            name: "Hetauda",
            district: "Makwanpur",
            province: "Bagmati",
            coordinates: { lat: 27.4287, lng: 85.0326 },
        },
        {
            id: "10",
            name: "Janakpur",
            district: "Dhanusha",
            province: "Madhesh",
            coordinates: { lat: 26.7288, lng: 85.9256 },
        },
    ]

    // Prevent page scroll when modal is open
    useEffect(() => {
        if (showMap) {
            // Prevent body scroll when map modal is open
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = "unset"
            }
        }
    }, [showMap])

    // Convert pixel coordinates to lat/lng
    const pixelToLatLng = (x, y, mapWidth, mapHeight) => {
        const lat = NEPAL_BOUNDS.north - (y / mapHeight) * (NEPAL_BOUNDS.north - NEPAL_BOUNDS.south)
        const lng = NEPAL_BOUNDS.west + (x / mapWidth) * (NEPAL_BOUNDS.east - NEPAL_BOUNDS.west)

        return {
            lat: Math.round(lat * 10000) / 10000, // Round to 4 decimal places
            lng: Math.round(lng * 10000) / 10000,
        }
    }

    // Handle coordinate selection (called by buttons or manual input)
    const selectCoordinates = (lat, lng, locationName = null) => {
        const coordinates = { lat, lng }
        const locationString = locationName || `Selected Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`

        // Update form data
        onChange(locationString, coordinates)
        setSelectedCoordinates(coordinates)
        setIsValid(true)
        setIsSelectMode(false)

        // Show visual feedback
        if (mapContainerRef.current) {
            const rect = mapContainerRef.current.getBoundingClientRect()
            const x = ((lng - NEPAL_BOUNDS.west) / (NEPAL_BOUNDS.east - NEPAL_BOUNDS.west)) * rect.width
            const y = ((NEPAL_BOUNDS.north - lat) / (NEPAL_BOUNDS.north - NEPAL_BOUNDS.south)) * rect.height

            setClickedPosition({ x, y })
            setTimeout(() => setClickedPosition(null), 2000)
        }
    }

    // Validate location
    const validateLocation = async (location) => {
        if (!location.trim()) {
            setIsValid(null)
            return
        }

        setIsValidating(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundLocation =
            nepalLocations.find(
                (loc) =>
                    loc.name.toLowerCase().includes(location.toLowerCase()) ||
                    loc.district.toLowerCase().includes(location.toLowerCase()),
            ) || location.includes("Selected Location")

        if (foundLocation) {
            setIsValid(true)
        } else {
            setIsValid(false)
            setSelectedCoordinates(null)
        }

        setIsValidating(false)
    }

    // Get location suggestions
    const getLocationSuggestions = (query) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        const filtered = nepalLocations.filter(
            (location) =>
                location.name.toLowerCase().includes(query.toLowerCase()) ||
                location.district.toLowerCase().includes(query.toLowerCase()) ||
                location.province.toLowerCase().includes(query.toLowerCase()),
        )

        setSuggestions(filtered.slice(0, 5))
    }

    // Handle input change with proper debouncing
    const handleInputChange = (e) => {
        const newValue = e.target.value
        onChange(newValue, selectedCoordinates || undefined)

        getLocationSuggestions(newValue)
        setShowSuggestions(true)

        // Clear previous timeout
        if (window.validationTimeout) {
            clearTimeout(window.validationTimeout)
        }

        // Debounce validation
        window.validationTimeout = setTimeout(() => {
            validateLocation(newValue)
        }, 300)
    }

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion) => {
        const locationString = `${suggestion.name}, ${suggestion.district}`

        // Update the form data through onChange
        onChange(locationString, suggestion.coordinates)

        // Update local state
        setSelectedCoordinates(suggestion.coordinates)
        setIsValid(true)
        setShowSuggestions(false)
        setSuggestions([])

        // Clear the input focus to hide suggestions
        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    // Get validation icon
    const getValidationIcon = () => {
        if (isValidating) {
            return <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        }
        if (isValid === true) {
            return <CheckCircle className="w-4 h-4 text-emerald-400" />
        }
        if (isValid === false) {
            return <AlertCircle className="w-4 h-4 text-red-400" />
        }
        return null
    }

    // Get validation message
    const getValidationMessage = () => {
        if (isValidating) return "Validating location..."
        if (isValid === true) return "Valid location"
        if (isValid === false) return "Location not found. Please select from suggestions or use the map."
        return null
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    ref={inputRef}
                    placeholder="Enter city, district, or select on map"
                    className="pl-10 pr-20 bg-slate-600 border-slate-500 text-white"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true)
                        }
                    }}
                    onBlur={() => {
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setShowSuggestions(false), 200)
                    }}
                />

                <div className="absolute right-3 top-3 flex items-center gap-2">
                    {getValidationIcon()}
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-emerald-400"
                        onClick={() => setShowMap(!showMap)}
                    >
                        <Map className="w-4 h-4" />
                    </Button>
                </div>

                {/* Location Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-700 border-slate-600">
                        <CardContent className="p-2">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="flex items-center justify-between p-2 hover:bg-slate-600 rounded cursor-pointer"
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                >
                                    <div>
                                        <div className="text-white font-medium">{suggestion.name}</div>
                                        <div className="text-gray-400 text-sm">
                                            {suggestion.district}, {suggestion.province}
                                        </div>
                                    </div>
                                    <MapPin className="w-4 h-4 text-emerald-400" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Validation Message */}
            {getValidationMessage() && (
                <div
                    className={`text-sm flex items-center gap-2 ${isValid === true ? "text-emerald-400" : isValid === false ? "text-red-400" : "text-gray-400"
                        }`}
                >
                    {getValidationIcon()}
                    {getValidationMessage()}
                </div>
            )}

            {/* Selected Location Info */}
            {isValid && selectedCoordinates && (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        Coordinates: {selectedCoordinates.lat.toFixed(4)}, {selectedCoordinates.lng.toFixed(4)}
                    </Badge>
                </div>
            )}

            {/* Interactive Map Modal */}
            {showMap && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-4xl h-[500px] bg-slate-800 border-slate-700">
                        <CardContent className="p-4 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold">
                                    {isSelectMode
                                        ? "Click on Map to Select Location"
                                        : "Browse Map (Enable Select Mode to Choose Location)"}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={isSelectMode ? "default" : "outline"}
                                        className={
                                            isSelectMode
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                : "border-emerald-500 text-emerald-400"
                                        }
                                        onClick={() => setIsSelectMode(!isSelectMode)}
                                    >
                                        {isSelectMode ? "Exit Select Mode" : "Enable Select Mode"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowMap(false)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>

                            {/* Interactive Map Container */}
                            <div className="relative w-full h-full bg-slate-700 rounded-lg overflow-hidden">
                                {/* Google Maps - Fully Interactive */}
                                <div
                                    ref={mapContainerRef}
                                    className="relative w-full h-full"
                                    onWheel={(e) => {
                                        // Prevent page scroll when scrolling over map
                                        e.stopPropagation()
                                    }}
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1773196.2196406813!2d82.5!3d28.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1aae74c5f983%3A0x38a0c5cd8c6b8c0!2sNepal!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full rounded-lg"
                                        title="Nepal Map"
                                    />

                                    {/* Selection overlay - only active in select mode */}
                                    {isSelectMode && (
                                        <div
                                            className="absolute inset-0 cursor-crosshair bg-emerald-500/5"
                                            onClick={(e) => {
                                                const rect = mapContainerRef.current.getBoundingClientRect()
                                                const x = e.clientX - rect.left
                                                const y = e.clientY - rect.top

                                                // Calculate coordinates
                                                const coordinates = pixelToLatLng(x, y, rect.width, rect.height)
                                                selectCoordinates(coordinates.lat, coordinates.lng)
                                            }}
                                        >
                                            {/* Clicked position marker */}
                                            {clickedPosition && (
                                                <div
                                                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse z-30 shadow-lg pointer-events-none"
                                                    style={{
                                                        left: clickedPosition.x,
                                                        top: clickedPosition.y,
                                                        transform: "translate(-50%, -50%)",
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Instructions Overlay */}
                                <div className="absolute top-2 left-2 bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-slate-600 pointer-events-none">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target className="w-4 h-4 text-emerald-400" />
                                        <span className="text-white font-semibold text-sm">Map Controls</span>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-300">
                                        <p>• Scroll to zoom in/out</p>
                                        <p>• Drag to pan around</p>
                                        <p>• Enable select mode to choose location</p>
                                        {isSelectMode && <p className="text-emerald-400">• Click anywhere to select!</p>}
                                    </div>
                                </div>

                                {/* Coordinates Display */}
                                {selectedCoordinates && (
                                    <div className="absolute top-2 right-2 bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 border border-emerald-500/50 pointer-events-none">
                                        <div className="text-emerald-400 font-semibold text-sm mb-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Selected:
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <div className="text-white">Lat: {selectedCoordinates.lat.toFixed(6)}°</div>
                                            <div className="text-white">Lng: {selectedCoordinates.lng.toFixed(6)}°</div>
                                        </div>
                                    </div>
                                )}

                                {/* Current Location Button */}
                                <div className="absolute right-2 bottom-16 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-600">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-emerald-400 hover:bg-slate-700 p-2"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(
                                                    (position) => {
                                                        selectCoordinates(position.coords.latitude, position.coords.longitude, "Current Location")
                                                    },
                                                    (error) => {
                                                        console.error("Error getting location:", error)
                                                        alert("Unable to get your current location. Please select manually.")
                                                    },
                                                )
                                            } else {
                                                alert("Geolocation is not supported by this browser.")
                                            }
                                        }}
                                        title="Use my current location"
                                    >
                                        <Target className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Quick Location Buttons */}
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-2 border border-slate-600">
                                        <div className="text-white text-xs font-medium mb-2">Quick Select:</div>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {nepalLocations.slice(0, 6).map((location) => (
                                                <Button
                                                    key={location.id}
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-slate-800/80 text-xs px-2 py-1 h-6"
                                                    onClick={() =>
                                                        selectCoordinates(
                                                            location.coordinates.lat,
                                                            location.coordinates.lng,
                                                            `${location.name}, ${location.district}`,
                                                        )
                                                    }
                                                >
                                                    {location.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Selection Confirmation */}
                                {selectedCoordinates && (
                                    <div className="absolute bottom-2 right-2">
                                        <Button
                                            size="sm"
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg text-xs px-3 py-1"
                                            onClick={() => {
                                                setShowMap(false)
                                                setClickedPosition(null)
                                                setIsSelectMode(false)
                                            }}
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Confirm
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
