"use client"
import { useEffect, useState } from 'react'

import { SectionTemplates } from '@/data/section-template'

import useLocalStorage from '@/hooks/useLocalStorage'

import Navbar from '@/app/_components/editor/Navbar'

import SectionColumn from '@/app/_components/editor/section-column'

import DownloadModal from '@/app/_components/editor/download-modal'
import { cn } from '@/lib/utils'

const page = () => {

  const [markdown, setMarkdown] = useState("");
  const [selectedSectionSlugs, setSelectedSectionSlugs] = useState([]);
  const [sectionSlugs, setSectionSlugs] = useState(
    SectionTemplates.map((sectionTemplate) => sectionTemplate.slug)
  );
  const [focusedSectionSlug, setFocusedSectionSlug] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState(SectionTemplates);
  const [showDrawer, setShowDrawer] = useState(false);

  const { backup } = useLocalStorage()

  useEffect(() => {
    if (backup) {
      setTemplates(backup)
    }
  }, [backup])

  const getTemplate = (slug) => {
    return templates.find((template) => template.slug === slug)
  }

  // Focused Section Template should be set to null every time page refrehes
  useEffect(() => {
    setFocusedSectionSlug(null)
  })

  //Keep track of which templates are selected
  useEffect(() => {

    // Safely retrieve stored slugs
    const storedSlugsString = localStorage.getItem("current-slug-list")
    const storedSlugs = storedSlugsString ? storedSlugsString.split(",") : []
  
    // Check if "title-and-description" exists in stored list
    const hasTitleAndDescription = storedSlugs.includes("title-and-description")
  
    // If stored list lacks it but current state has it, remove it
    if (!hasTitleAndDescription &&
      selectedSectionSlugs.includes("title-and-description")
    ) {
      setSelectedSectionSlugs(prev => prev.filter(slug => slug !== "title-and-description"))
    }
  
    // Update focused slug from stored list or current state
    const focusedSlug = storedSlugs[0] || null
    setFocusedSectionSlug(focusedSlug)
  
    // Store the current selectedSectionSlugs in localStorage
    localStorage.setItem("current-slug-list", selectedSectionSlugs.join(","));
  }, [selectedSectionSlugs])

  return (
    <div className='w-screen h-screen bg-[#1b1d1e] bg-dot-8-s-2-neutral-950'>
      <Navbar
        selectedSectionSlugs={selectedSectionSlugs}
        setShowModal={setShowModal}
        getTemplate={getTemplate}
        onMenuClick={() => setShowDrawer(!showDrawer)}
        isDrawerOpen={showDrawer}
      />

      {
        showModal &&
        <DownloadModal
          setShowModal={setShowModal}
        />
      }

      <div className='flex md:px-6 md:pt-6'>
        <div className={
          cn(
            "flex flex-0 text-white drawer-height absolute md:static p-6 md:p-0 bg-white md:bg-transparent shadow md:shadow-none z-10 md:z-0 transform transition-transform duration-500 ease-in-out",
            showDrawer ? "" : "-translate-x-full md:transform-none"
          )
        }>
          <SectionColumn
            selectedSectionSlugs={selectedSectionSlugs}
            setSelectedSectionSlugs={setSelectedSectionSlugs}
            sectionSlugs={sectionSlugs}
            setSectionSlugs={setSectionSlugs}
            setFocusedSectionSlug={setFocusedSectionSlug}
            focusesSectionSlug={focusedSectionSlug}
            templates={templates}
            originalTemplate={SectionTemplates}
            setTemplates={setTemplates}
            getTemplate={getTemplate}
          />
        </div>
        {/* Edit Preview Container */}
      </div>
    </div>
  )
}

export default page