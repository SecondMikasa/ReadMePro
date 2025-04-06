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
  const [selectedSectionSlugs, setSelectedSectionSlugs] = useState(["title-and-description"]);
  const [sectionSlugs, setSectionSlugs] = useState(
    SectionTemplates.map((sectionTemplate) => sectionTemplate.slug)
  );
  const [focusedSectionSlug, setFocusedSectionSlug] = useState("title-and-description");
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState(SectionTemplates);
  const [showDrawer, setShowDrawer] = useState(false);

  const { backup } = useLocalStorage()

  useEffect(() => {
    // Initialize from localStorage or use defaults
    const storedSlugs = localStorage.getItem("current-slug-list");
    if (storedSlugs) {
      setSelectedSectionSlugs(storedSlugs.split(","));
      setFocusedSectionSlug(storedSlugs.split(",")[0]);
    }

    if (backup) {
      setTemplates(backup);
    } else {
      setTemplates(SectionTemplates);
    }
  }, [backup]);

  const getTemplate = (slug) => {
    return templates.find((template) => template.slug === slug) ||
      SectionTemplates.find((template) => template.slug === slug);
  }

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
        <div className={cn(
          "flex flex-0 text-white drawer-height absolute md:static p-6 md:p-0 bg-white md:bg-transparent shadow md:shadow-none z-10 md:z-0 transform transition-transform duration-500 ease-in-out",
          showDrawer ? "" : "-translate-x-full md:transform-none"
        )}>
          <SectionColumn
            selectedSectionSlugs={selectedSectionSlugs}
            setSelectedSectionSlugs={setSelectedSectionSlugs}
            sectionSlugs={sectionSlugs}
            setSectionSlugs={setSectionSlugs}
            focusedSectionSlug={focusedSectionSlug}
            setFocusedSectionSlug={setFocusedSectionSlug}
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