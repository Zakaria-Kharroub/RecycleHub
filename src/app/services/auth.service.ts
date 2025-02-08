import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map, catchError } from "rxjs/operators";

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000";
  private currentUserSubject: BehaviorSubject<Partial<User> | null>;
  public currentUser: Observable<Partial<User> | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<Partial<User> | null>(
      JSON.parse(localStorage.getItem("currentUser") || "null")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Partial<User> | null {
    return this.currentUserSubject.value;
  }

  public get userFirstName():string{
    return this.currentUserValue?.firstName || '';
  }

  public get useId():string{
    return this.currentUserValue?.id || '';
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  login(credentials: { email: string; password: string }): Observable<Partial<User>> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map((users: User[]) => {
        const user = users.find(u =>
          u.email === credentials.email &&
          u.password === credentials.password
        );

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        const userToStore: Partial<User> = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };

        localStorage.setItem("currentUser", JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
        return userToStore;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Email ou mot de passe incorrect'));
      })
    );
  }

  register(user: Omit<User, 'id'>): Observable<Partial<User>> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      map((response: User) => {
        const userToStore: Partial<User> = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
        };
        localStorage.setItem("currentUser", JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
        return userToStore;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Une erreur est survenue lors de l\'inscription'));
      })
    );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
