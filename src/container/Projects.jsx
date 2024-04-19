import React, {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdBookmark } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa6';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

const Projects = () => {
  let projects = useSelector((state) => state.projects?.projects);
  const user = useSelector((state) => state.user?.user);
  const searchTerm = useSelector((state) => state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm: "");
  const [filtered, setFiltered] = useState(null);
  projects=projects?.filter(project => project?.user?.uid===user?.uid);
  useEffect(() => {
  }, []);
  useEffect(() => {
    if(searchTerm?.length>0){
      setFiltered(
        projects?.filter(project => {
          const lowerCaseItem = project?.title.toLowerCase();
          return searchTerm.split("").every((letter) => lowerCaseItem.includes(letter));
        })
      );
    }else{
      setFiltered(null);
    }
  },[searchTerm])
  return (
    <div className='w-full py-6 flex items-center justify-center gap-6 flex-wrap'>
      {filtered ? <>
        {filtered && filtered.map((project, index) =>  
        <>
          <Link to={`/projects/${project.id}`} >
            <ProjectCard key={project.id} project={project} index={index} />
          </Link>
        </>)}
      </> : <>
      {projects && projects.map((project, index) => 
        <>
          
            <ProjectCard key={project.id} project={project} index={index} />
        </>)}
      </>}
    </div>
  )
}

const ProjectCard = ({project, index}) => {
  const [isDelete, setIsDelete] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        setIsDelete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const deleteProject = async () => {
    await deleteDoc(doc(db, "Projects", project.id)).then(()=>{}).catch(err=>console.log(err));
  }
  return (
    <motion.div
     key={index}
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     exit={{opacity: 0}}
     transition={{duration: 0.5, delay: index * 0.1}}
     className='w-full cursor-pointer md:w-[350px] h-[275px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4'>
      <div className='bg-primary w-full h-full rounded-md overflow-hidden' style={{overflow: 'hidden', height: "100%"}}>
          <iframe
              title="Result"
              srcDoc={project.output}
              style={{border: "none", width: "100%", height: "100%"}}
          />
      </div>
      <div className='flex items-center justify-start gap-3 w-full'>
        <div className='w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerald-500'>
        {project?.user?.photoURL ? (
          <motion.img 
          whileHover={{scale:1.2}}
          src={project?.user?.photoURL}
          alt=""
          referrerPolicy='no-referrer'
          className='w-full h-full object-cover'
          />
        ):(
          <p className='text-xl text-white font-semibold capitalize'>
            {project?.user?.email[0]}
          </p>
        )}
        </div>
        <Link to={`/projects/${project.id}`} >
          <p className='text-white text-md capitalize'>{project?.title}</p>
          <p className='text-primaryText text-sm capitalize'>
            {project?.user?.displayName ? project?.user?.displayName : `${project?.user.email.split("@")[0]}`}
          </p>
        </Link>
        <div className='relative cursor-pointer ml-auto'>
        <motion.div whileTap={{scale: .9}}>
          <FaTrash onClick={() => setIsDelete(!isDelete)} className='text-primaryText text-xl'/>
          </motion.div>
         {isDelete && <motion.div ref={elementRef} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} whileTap={{scale: .9}} whileHover={{scale: 1.1}} onClick={deleteProject} className='px-6 py-1 w-auto text-primaryText font-medium bg-primary absolute right-8 -top-[3px] rounded-md shadow-sm shadow-secondary'>Delete?</motion.div>}
        
        </div>
      </div>
    </motion.div>
  );
}



export default Projects;