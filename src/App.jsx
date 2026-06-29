import { useState } from 'react'
import MinimalHeader from './components/MinimalHeader'
import HolidaySearchCard from './components/HolidaySearchCard'
import HolidayResults from './components/HolidayResults'
import DestinationDetail from './components/DestinationDetail'
import PackageDetail from './components/PackageDetail'
import Footer from './components/Footer'

export default function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchPayload, setSearchPayload] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [viewMode, setViewMode] = useState("home") // "home" | "results" | "detail" | "packageDetail"

  const handleSearch = (payload) => {
    setSearchPayload(payload)
    setIsLoading(true)
    setSearchResults(null)
    setViewMode("results")

    // Simulate API call
    setTimeout(() => {
      setSearchResults(payload)
      setIsLoading(false)
    }, 1500)
  }

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination)
    setViewMode("detail")
  }

  const handleBackClick = () => {
    setSelectedDestination(null)
    setViewMode("results")
  }

  const handleBackToHome = () => {
    setSearchResults(null)
    setSelectedDestination(null)
    setViewMode("home")
  }

  const handlePackageClick = (packageData) => {
    setSelectedPackage(packageData)
    setViewMode("packageDetail")
  }

  const handleBackFromPackage = () => {
    setSelectedPackage(null)
    setViewMode(selectedDestination ? "detail" : "results")
  }

  if (viewMode === "packageDetail" && selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white flex flex-col">
        <MinimalHeader onHomeClick={handleBackToHome} />
        <div className="flex-grow">
          <PackageDetail
            package={selectedPackage}
            onBack={handleBackFromPackage}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (viewMode === "detail" && selectedDestination) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white flex flex-col">
        <MinimalHeader onHomeClick={handleBackToHome} />
        <div className="flex-grow">
          <DestinationDetail
            destination={selectedDestination}
            onBack={handleBackClick}
            onPackageClick={handlePackageClick}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (viewMode === "results" && searchResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white flex flex-col">
        <MinimalHeader onHomeClick={handleBackToHome} />
        <div className="flex-grow">
          <HolidayResults
            payload={searchResults}
            isLoading={isLoading}
            onDestinationClick={handleDestinationClick}
            onBackToHome={handleBackToHome}
            onPackageClick={handlePackageClick}
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex flex-col flex-grow">
        <HolidaySearchCard
          onSearch={handleSearch}
          onCategorySearch={handleSearch}
          onDestinationClick={handleDestinationClick}
          onPackageClick={handlePackageClick}
        />
      </main>
      <Footer />
    </div>
  )
}
