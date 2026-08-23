"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountsService } from "@/services/accounts-service";
import Navbar from "@/components/Navbar";
import CustomSelect from "@/components/admin/CustomSelect";
import { Eye, EyeOff } from "lucide-react";
import styles from "./CustomerAuth.module.css";

type AuthMode = "login" | "register";

export default function CustomerAuth({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", referral: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("");
    const [phonePrefixOptions, setPhonePrefixOptions] = useState<{ value: string; label: string; icon: string | null }[]>([]);
  const isRegister = mode === "register";
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

    useEffect(() => {
        if (!isRegister) return;

        const loadCountries = async () => {
            try {
                const countries = await accountsService.getCountries();
                setPhonePrefixOptions(countries.map((country) => ({
                    value: String(country.id),
                    label: country.dial_code,
                    icon: country.flag,
                })));
                const defaultCountry = countries.find((country) => country.iso_code === "US") || countries[0];
                if (defaultCountry) setPhonePrefix(String(defaultCountry.id));
            } catch {
                setPhonePrefixOptions([]);
            }
        };

        loadCountries();
    }, [isRegister]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (isRegister && form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      if (isRegister) {
        await accountsService.register({ full_name: form.fullName, email: form.email, phone_number: form.phone, password: form.password, confirm_password: form.confirmPassword, country_code: phonePrefix ? Number(phonePrefix) : 1 });
        setMessage("Account created. Please sign in to continue.");
        setTimeout(() => router.push("/customer/login"), 900);
      } else {
        const response = await accountsService.login({ email: form.email, password: form.password });
        localStorage.setItem("drifully_customer_user", JSON.stringify(response.user || { email: form.email }));
        router.replace("/customer");
      }
    } catch (requestError: unknown) {
      const response = requestError as { response?: { data?: { message?: string; error?: string } } };
      setError(response.response?.data?.message || response.response?.data?.error || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return <main className={styles.page}>
    <Navbar />
    <div className={styles.body}>
        <section className={styles.visual} aria-label="Drifully car rental introduction"><Image className={styles.visualBackground} src="/customer app/257a09680b948a4012ee2fbad1c71c6c0d941bd7.jpg" alt="Customer using the Drifully app" fill priority sizes="(max-width: 900px) 100vw, 56vw" /><Image className={`${styles.vehicleCard} ${styles.cardOne}`} src="/customer app/frame-1.png" alt="Toyota Corolla rental" width={240} height={174} /><Image className={`${styles.vehicleCard} ${styles.cardTwo}`} src="/customer app/Frame-2-b.png" alt="Luxury car rental" width={240} height={174} /><div className={styles.visualCopy}><h2 className={styles.visualTitle}>Find the Car That Fits Your Journey.</h2><p className={styles.visualText}>Sign in or create an account to explore our vehicles, book your next ride, and enjoy a seamless journey with Drifully.</p><div className={styles.visualActions}><Link className={styles.fleetButton} href="/our-fleet">Browse Our Fleet</Link><a className={styles.appLink} href="https://play.google.com/store/apps/details?id=com.drifully.app">Download The App</a></div></div></section>
        <section className={styles.formSide}>
            <div className={styles.formWrap}>
                <div className={styles.tabs}>
                    <Link className={`${styles.tab} ${isRegister ? styles.tabActive : ""}`} href="/customer/register">
                    Create Account
                    </Link>
                    <Link className={`${styles.tab} ${!isRegister ? styles.tabActive : ""}`} href="/customer/login">
                    Sign In
                    </Link>
                    </div>
                    <h1 className={styles.formHeading}>
                        {isRegister ? "Create Account" : "Sign In To Continue"}
                    </h1>
                    <p className={styles.formSubtitle}>{isRegister ? "Start your journey in minutes" : "Welcome back. Your next journey starts here."}
                    </p>
                    {error && 
                    <p className={styles.error} role="alert">
                        {error}
                    </p>}
                    {message && 
                    <p className={styles.success} role="status">
                    {message}
                    </p>}
                    <form className={styles.form} onSubmit={submit}>
                        {isRegister && 
                        <div className={styles.twoColumns}>
                            <div className={styles.field}>
                                <label htmlFor="full-name">Full Name</label>
                                <input 
                                id="full-name" 
                                required 
                                placeholder="e.g John Doe" 
                                value={form.fullName} 
                                onChange={(event) => update("fullName", event.target.value)} 
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="register-email">Email Address</label>
                                <input 
                                id="register-email" 
                                required 
                                type="email" 
                                placeholder="e.g JDoe@gmail.com" 
                                value={form.email} 
                                onChange={(event) => update("email", event.target.value)} 
                                />
                            </div>
                        </div>
                        }
                        {!isRegister && 
                        <div className={styles.field}><label htmlFor="login-email">Email Address</label>
                        <input id="login-email" required type="email" placeholder="e.g john@gmail.com" value={form.email} onChange={(event) => update("email", event.target.value)} />
                        </div>}
                        {isRegister && 
                        <div className={styles.field}>
                            <label htmlFor="phone">Phone Number</label>
                            <div className={styles.phoneInput}>
                            <div className={styles.countrySelect}>
                                <CustomSelect
                                    name="phonePrefix"
                                    value={phonePrefix}
                                    placeholder="+1"
                                    options={phonePrefixOptions}
                                    onChange={(_name, value) => setPhonePrefix(value)}
                                    variant="minimal"
                                />
                            </div>
                                <input id="phone" required placeholder="(555) 000-0000" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                            </div>
                        </div>
                        }
                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordWrap}>
                                <input id="password" required type={showPassword ? "text" : "password"} placeholder="••••••••••" value={form.password} onChange={(event) => update("password", event.target.value)} />
                                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} strokeWidth={1.8} aria-hidden="true" /> : <Eye size={16} strokeWidth={1.8} aria-hidden="true" />}</button>
                            </div>
                        </div>
                        {isRegister && 
                        <>
                            <div className={styles.field}>
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className={styles.passwordWrap}>
                                    <input id="confirm-password" required type="password" placeholder="••••••••••" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} />
                                    <Eye size={16} strokeWidth={1.8} className={styles.passwordToggle} aria-hidden="true" />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="referral">Referral Code</label>
                                <input id="referral" placeholder="e.g WERT283-EDD" value={form.referral} onChange={(event) => update("referral", event.target.value)} />
                            </div>
                        </>}
                        {!isRegister && 
                        <Link className={styles.forgot} href="/customer/login">Forgot Password?</Link>}
                        <button className={styles.submit} disabled={loading}>{loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}</button>
                                
                    </form>
                    {/* {isRegister && <p className={styles.terms}>By creating an account, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>} */}
                </div>
        </section>
    </div>
  </main>;
}