import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children : React.ReactNode ;
}

const Layout = ( props : Props)=>{
    const children = props.children ;
  return(
    <SidebarProvider>
        <DashboardSidebar/>
        <main className="flex flex-col h-screen w-screen bg-muted">
            {children}
        </main>
    </SidebarProvider>
  )
}

export default Layout;