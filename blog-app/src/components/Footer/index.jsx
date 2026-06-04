import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export default function Footer() {
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-[var(--bg-secondary)] py-10 md:py-12 flex flex-col md:flex-row items-start justify-between border-t border-[var(--border-color)] transition-colors">
            <div>
                <img className="max-w-12" alt="Logo" src={logoImg}/>
                <div className="max-w-[410px] mt-6 text-[var(--text-muted)] text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat
                    eveniet cumque accusamus atque qui error quo enim fugiat?
                </div>
            </div>

            <div className="flex flex-wrap justify-between w-full md:w-auto mt-10 md:mt-0">
                <div className="flex justify-between w-full min-w-[100%] md:min-w-[450px] gap-8 flex-col md:flex-row">
                    <div>
                        <h3 className="font-semibold text-base mb-5 text-[var(--text-main)]">Quick Links</h3>
                        <ul className="space-y-1">
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Home</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Best Sellers</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Offers & Deals</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Contact Us</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">FAQs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-5 text-[var(--text-main)]">Need Help?</h3>
                        <ul className="space-y-1">
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Delivery Information</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Return & Refund Policy</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Payment Methods</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Track your Order</Link></li>
                            <li><Link className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" to="/">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-5 text-[var(--text-main)]">Follow Us</h3>
                        <ul className="space-y-1">
                            <li><a className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" href="/">Instagram</a></li>
                            <li><a className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" href="/">Twitter</a></li>
                            <li><a className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" href="/">Facebook</a></li>
                            <li><a className="text-[var(--text-muted)] text-[13px] hover:text-[#5A52F6] transition-colors" href="/">YouTube</a></li>
                        </ul>
                    </div>

                </div>
            </div>

        </div>
    );
}