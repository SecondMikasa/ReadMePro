"use client"
import { useEffect, useState } from 'react'

import { SectionTemplates } from '@/data/section-template'
import useLocalStorage from '@/hooks/useLocalStorage'
import Navbar from '@/app/_components/editor/Navbar'

import Head from 'next/head';

const page = () => {

  const [markdown, setMarkdown] = useState("");
  const [selelctedSectionSlugs, setSelelctedSectionSlugs] = useState([]);
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

    if (!hasTitleAndDescription && selelctedSectionSlugs.includes("title-and-description")) {
      selelctedSectionSlugs = selelctedSectionSlugs.filter((slug) => slug !== "title-and-description");  
    }

    setFocusedSectionSlug(localStorage.getItem("current-slug-list").split(",")[0])

    localStorage.setItem("current-slug-list", focusedSectionSlug)
  }, [selelctedSectionSlugs])

  return (
    <div className='w-full h-full'>
        <Navbar
          selelctedSectionSlugs={selelctedSectionSlugs}
          setShowModal={setShowModal}
          getTemplate={getTemplate}
          onMenuClick={() => setShowDrawer(!showDrawer)}
          isDrawerOpen={showDrawer}
        />
      
    </div>
  )
}

export default page