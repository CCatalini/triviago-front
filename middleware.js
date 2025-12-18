import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get the JWT token from cookies
    const token = request.cookies.get("jwt")?.value;

    const unprotectedRoutes = ['/login', '/signin', '/'];
    const protectedRoutes = ['/home', '/quiz', '/quizcreation', '/user', '/passwordUpdate'];
    const pathToCheck = request.nextUrl.pathname;

    const isPathProtected = protectedRoutes.some(route => pathToCheck.startsWith(route));
    const isPathUnprotected = unprotectedRoutes.some(route => pathToCheck === route || (route !== '/' && pathToCheck.startsWith(route)));

    // Si la ruta está protegida y no hay token, redirigir a login
    if (isPathProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    
    // Si hay token y está en una ruta de login/signin, redirigir a home
    if (isPathUnprotected && token && (pathToCheck === '/login' || pathToCheck === '/signin' || pathToCheck === '/')) {
        const homeUrl = new URL('/home', request.url);
        return NextResponse.redirect(homeUrl);
    }

    // Continuar con la request
    return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
    matcher: [
        '/home/:path*',
        '/quiz/:path*',
        '/quizcreation/:path*',
        '/user/:path*',
        '/passwordUpdate/:path*',
        '/login',
        '/signin',
        '/'
    ]
}