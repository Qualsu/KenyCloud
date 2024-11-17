import { Alert } from "./landing/alert"
import { Footer } from "./landing/footer"
import Main from "./landing/main"

export default async function Landing(){
    return (
        <div className="flex flex-col min-h-screen">
            <Alert/>
            <main className="flex-grow flex items-center justify-center">
                <Main/>
            </main>
            <Footer/>
        </div>
    )
}