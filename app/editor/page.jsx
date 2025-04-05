"use client"
import { useEffect, useState } from 'react'

import { SectionTemplates } from '@/data/section-template'
import useLocalStorage from '@/hooks/useLocalStorage'
import Navbar from '@/app/_components/editor/Navbar'
import DownloadModal from '@/app/_components/download-modal'

import Head from 'next/head';

const page = () => {

  const [markdown, setMarkdown] = useState("");
  const [selectedSectionSlugs, setSelectedSectionSlugs] = useState([]);
  const [sectionSLugs, setSectionSLugs] = useState(
    SectionTemplates.map((t) => t.slug)
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
    return templates.find((t) => t.slug === slug)
  }

  // Focused Section Template should be set to null every time page refrehes
  useEffect(() => {
    setFocusedSectionSlug(null)
  }, [])

  //Keep track of which templates are selected
  useEffect(() => {
    let currentSlugList = JSON.parse(localStorage.getItem("current-slug-list")) || [];
    const hasTitleAndDescription = currentSlugList.includes("title-and-description");

    if (!hasTitleAndDescription && selectedSectionSlugs.includes("title-and-description")) {
      selectedSectionSlugs = selectedSectionSlugs.filter((slug) => slug !== "title-and-description");
    }

    setFocusedSectionSlug(localStorage.getItem("current-slug-list").split(",")[0])

    localStorage.setItem("current-slug-list", focusedSectionSlug)
  }, [selectedSectionSlugs])

  const drawerClass = showDrawer ? "" : "-translate-x-full md:transform-none"

  return (
    <div className='w-screen h-screen bg-[#1b1d1e] bg-dot-8-s-2-neutral-950'>
      <Navbar
        selectedSectionSlugs={selectedSectionSlugs}
        setShowModal={setShowModal}
        getTemplate={getTemplate}
        onMenuClick={() => setShowDrawer(!showDrawer)}
        isDrawerOpen={showDrawer}
      />

      {showModal && <DownloadModal setShowModal={setShowModal} />}

      <div className='flex md:px-6 md:pt-6'>
        <div className={`flex flex-0 text-white drawer-height absolute md:static p-6 md:p-0 bg-white md:bg-transparent shadow md:shadow-none z-10 md:z-0 transform transition-transform duration-500 ease-in-out ${drawerClass}`}>
          Sections Column
        </div>
        Edit
      </div>
    </div>
  )
}

export default page