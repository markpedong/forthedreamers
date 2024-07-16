import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import styles from './styles.module.scss'
import { PageTitle } from '@/components/page-components'
import {
	CANCELLATION_TERMS,
	CHANGE_OF_MIND_RETURNS_TERMS,
	DEFINITIONS_AND_INTERPRETATION_TERMS,
	DELIVERY_TERMS,
	DISCLAIMER_AND_LIABILITY_TERMS,
	DISPUTE_RESOLUTION_TERMS,
	FAULTY_PRODUCT_RETURNS_TERMS,
	GENERAL_TERMS,
	GIFT_CARDS_TERMS,
	INDEMNITY_TERMS,
	ORDER_AND_CONTRACT_TERMS,
	PRIVACY_POLICY_TERMS,
	SITE_INFORMATION_TERMS,
	TERMS_ARRAY,
	USER_GENERATED_CONTENT_TERMS
} from '@/app/(main)/constants'
import { FC } from 'react'

const roboto = Roboto_Condensed({ weight: ['400', '600', '800'], subsets: ['latin'] })

const TermsSection: FC<{ terms: string[]; title: string }> = ({ title, terms }) => {
	return (
		<div className="mt-10 fcol gap-3">
			<span className="font-bold">{title}</span>
			{terms.map((term, index) => (
				<div key={index} dangerouslySetInnerHTML={{ __html: term }} />
			))}
		</div>
	)
}

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<PageTitle title="Terms of Service" className="!capitalize" />
			<div className="fcol gap-3">
				<span className="font-bold">Welcome to CHARLOTTE FOLK.</span>
				<span>
					The website https://charlottefolk.co/ and its associated features (“Site") is owned and operated by
					CHARLOTTE FOLK (“CHARLOTTE FOLK”, "we", "our", "us").
				</span>
				<span>
					These Terms and Conditions (“Terms”), which incorporate our Privacy Policy and other documents
					referred to within these Terms, govern the supply of any products ordered by you on the Site and
					your use of the Site. By browsing, accessing, using the Site or ordering a product (“Order”), you
					agree to be legally bound by these Terms. We may change these Terms at any time, and the revised
					Terms will be made available on our Site. By continuing to use the Site you agree to be bound by
					such revised Terms.
				</span>
			</div>
			<TermsSection title="1. ACCESS AND USE OF THE SITE" terms={TERMS_ARRAY} />
			<TermsSection title="2. INFORMATION ON THIS SITE" terms={SITE_INFORMATION_TERMS} />
			<TermsSection title="3. ORDER AND FORMATION OF CONTRACT" terms={ORDER_AND_CONTRACT_TERMS} />
			<TermsSection title="4. DELIVERY" terms={DELIVERY_TERMS} />
			<TermsSection title="5. CANCELLATION" terms={CANCELLATION_TERMS} />
			<TermsSection title="6. FAULTY PRODUCT RETURNS" terms={FAULTY_PRODUCT_RETURNS_TERMS} />
			<TermsSection title="7. CHANGE OF MIND RETURNS" terms={CHANGE_OF_MIND_RETURNS_TERMS} />
			<TermsSection title="8. GIFT CARDS" terms={GIFT_CARDS_TERMS} />
			<TermsSection title="9. USER GENERATED CONTENT" terms={USER_GENERATED_CONTENT_TERMS} />
			<TermsSection title="10. DISCLAIMER AND LIABILITY" terms={DISCLAIMER_AND_LIABILITY_TERMS} />
			<TermsSection title="11. INDEMNITY" terms={INDEMNITY_TERMS} />
			<TermsSection title="12. PRIVACY POLICY AND COMMUNICATIONS" terms={PRIVACY_POLICY_TERMS} />
			<TermsSection title="13. DISPUTE RESOLUTION" terms={DISPUTE_RESOLUTION_TERMS} />
			<TermsSection title="14. GENERAL" terms={GENERAL_TERMS} />
			<TermsSection title="15. DEFINITIONS AND INTERPRETATION" terms={DEFINITIONS_AND_INTERPRETATION_TERMS} />
		</div>
	)
}

export default Page
