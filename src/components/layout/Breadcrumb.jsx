import React from 'react'
import { ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBreadcrumbs } from '../../services/breadcrumbs'
import { temas } from '../../styles/temas'

const Breadcrumb = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const crumbs = getBreadcrumbs(location.pathname)

    if (crumbs.length === 0) return null

    return (
        <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm mb-4">
            {crumbs.map((crumb, index) => {
                const esUltimo = index === crumbs.length - 1
                return (
                    <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight size={14} className={temas.breadcrumb.separator} />}
                        {crumb.path && !esUltimo ? (
                            <button
                                onClick={() => navigate(crumb.path)}
                                className={`${temas.breadcrumb.link} transition-colors`}
                            >
                                {crumb.label}
                            </button>
                        ) : (
                            <span className={esUltimo ? temas.breadcrumb.active : temas.breadcrumb.text}>
                                {crumb.label}
                            </span>
                        )}
                    </span>
                )
            })}
        </nav>
    )
}

export default Breadcrumb
